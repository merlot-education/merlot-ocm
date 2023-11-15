import type ConnectionCreateInvitationDto from '../entities/connectionCreateInvitationDto.entity.js';
import type ConnectionSubscriptionEndpointDto from '../entities/connectionSubscribeEndPoint.entity.js';
import type ConnectionDto from '../entities/entity.js';
import type { Connection, Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import PrismaService from '../../prisma/prisma.service.js';
import logger from '../../utils/logger.js';
import pagination from '../../utils/pagination.js';
import ConnectionRepository from '../repository/connection.repository.js';

@Injectable()
export default class ConnectionsService {
  private connectionRepository: ConnectionRepository;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly natsClient: NatsClientService,
    private readonly restClient: RestClientService,
    private readonly configService: ConfigService,
  ) {
    this.connectionRepository = new ConnectionRepository(this.prismaService);
  }

  static readonly connectionAlias = {
    MEMBER: 'member',
    SUBSCRIBER: 'subscriber',
    TRUST: 'trust',
  };

  static readonly status = {
    DEFAULT: 'invited',
    INVITED: 'invited',
    REQUESTED: 'requested',
    RESPONDED: 'responded',
    COMPLETE: 'complete',
    TRUSTED: 'trusted',
  };

  static readonly roles = {
    INVITER: 'inviter',
    INVITEE: 'invitee',
  };

  async createConnections(connection: ConnectionDto) {
    logger.info(
      `connection service create connection connection?.invitation?.serviceEndpoint is ${connection?.invitation?.serviceEndpoint}`,
    );
    const insertData = {
      ...connection,
    };
    delete insertData.invitation;
    return this.connectionRepository.createConnection({
      ...insertData,
    });
  }

  async sendConnectionStatusToPrincipal(
    status: string,
    connectionId: string,
    theirLabel: string,
    participantDID: string,
    theirDid: string,
  ) {
    try {
      const response =
        await this.natsClient.sendConnectionStatusPrincipalManager(
          status,
          connectionId,
          theirLabel,
          participantDID,
          theirDid,
        );
      return response;
    } catch (error: unknown) {
      logger.error(String(error));
      return error;
    }
  }

  async sendMembershipProofRequestToProofManager(connectionId: string) {
    try {
      const response =
        await this.natsClient.sendMembershipProofRequestToProofManager(
          connectionId,
        );
      return response;
    } catch (error: unknown) {
      logger.error(String(error));
      return error;
    }
  }

  async updateStatusByConnectionId(connection: ConnectionDto) {
    return this.connectionRepository.updateConnection({
      where: { connectionId: connection.connectionId },
      data: {
        status: connection.status,
        theirDid: connection.theirDid,
        theirLabel: connection.theirLabel,
        updatedDate: new Date(),
      },
    });
  }

  getConnectionByID(connectionId: string) {
    return this.connectionRepository.findByConnectionId(connectionId);
  }

  getAgentUrl() {
    return this.configService.get('agent');
  }

  getAppUrl() {
    return this.configService.get('APP_URL');
  }

  async findConnections(
    pageSize: number,
    page: number,
    status: string | false,
    connectionId = '',
    participantDid = '',
  ) {
    let query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ConnectionWhereUniqueInput;
      where?: Prisma.ConnectionWhereInput;
      orderBy?: Prisma.ConnectionOrderByWithRelationInput;
    } = {};

    if (connectionId) {
      return this.connectionRepository.findByConnectionId(connectionId);
    }

    if (participantDid) {
      return this.connectionRepository.findByConnectionByParticipantDID(
        participantDid,
      );
    }

    if (status) {
      const statuses: string[] = status.split(',');
      query.where = { status: { in: statuses } };
    }

    query = { ...query, ...pagination(pageSize, page) };

    return this.connectionRepository.findConnections(query);
  }

  async createInvitationURL(connectionCreate: ConnectionCreateInvitationDto) {
    const { agentUrl } = this.getAgentUrl();
    const appUrl = this.getAppUrl();
    const responseData = await this.restClient.post(
      `${agentUrl}/connections/create-invitation`,
      connectionCreate,
    );

    const shortRow = await this.connectionRepository.createShortUrl(
      responseData.invitationUrl,
    );
    responseData.invitationUrlShort = `${appUrl}/v1/url/${shortRow.id}`;
    return responseData;
  }

  async findConnectionByShortUrlId(id: string) {
    return this.connectionRepository.getShortUrl(id);
  }

  async getConnectionInformationRequest(connectionId = '', did = '') {
    try {
      let connectionDetails: Connection | null = null;

      if (connectionId) {
        connectionDetails =
          await this.connectionRepository.findByConnectionId(connectionId);
      }

      if (did && !connectionDetails) {
        connectionDetails =
          await this.connectionRepository.findByConnectionByParticipantDID(did);
      }

      if (!connectionDetails) {
        return null;
      }

      const response = {
        issueCredentials: [],
        presentProofs: [],
      };

      const issueCredentials = await this.natsClient.getIssueCredentials(
        connectionDetails.connectionId,
      );

      if (
        issueCredentials &&
        Array.isArray(issueCredentials) &&
        !!issueCredentials[1]
      ) {
        const [, issueCredentialsArr] = issueCredentials;
        response.issueCredentials = issueCredentialsArr;
      }

      const presentProofs = await this.natsClient.getPresentProofs(
        connectionDetails.connectionId,
      );

      if (presentProofs && Array.isArray(presentProofs) && !!presentProofs[1]) {
        const [, presentProofsArr] = presentProofs;
        response.presentProofs = presentProofsArr;
      }

      return response;
    } catch (error) {
      logger.error(JSON.stringify(error));
      return error;
    }
  }

  async makeConnectionTrusted(connectionId: string) {
    return this.connectionRepository.updateConnection({
      where: { connectionId },
      data: {
        status: ConnectionsService.status.TRUSTED,
        updatedDate: new Date(),
      },
    });
  }

  publishConnectionSubscriberEndpoint(data: ConnectionSubscriptionEndpointDto) {
    this.natsClient.publishConnection(data);
  }

  async acceptConnectionInvitation(
    agentURL: string,
    payload: {
      invitationUrl: string;
      autoAcceptConnection: boolean;
      alias: string;
    },
  ) {
    return this.restClient.post(
      `${agentURL}/connections/receive-invitation-url`,
      payload,
    );
  }

  async getReceivedConnections() {
    return this.connectionRepository.findConnections({
      where: { isReceived: true },
      select: { connectionId: true },
    });
  }
}
