import type CredentialDto from '../entities/credential.entity.js';
import type CredentialTypeDto from '../entities/credentialType.entity.js';
import type OfferCredentialDto from '../entities/entity.js';
import type GetIssueCredentialsDto from '../entities/get-issue-credentials.dto.js';
import type ProposeCredentialDto from '../entities/propose-credential.dto.js';
import type { Credential, Prisma } from '@prisma/client';

import {
  BadRequestException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import TSAClientService from '../../client/tsa.client.js';
import { TSAService } from '../../common/constants.js';
import CredentialDefService from '../../credentialDef/services/service.js';
import PrismaService from '../../prisma/prisma.service.js';
import Utils from '../../utils/common.js';
import logger from '../../utils/logger.js';
import pagination from '../../utils/pagination.js';
import CredentialRepository from '../repository/credential.repository.js';
import CredentialsTypeRepository from '../repository/credentialType.repository.js';

@Injectable()
export default class AttestationService {
  private credentialRepository: CredentialRepository;

  private credentialRepositoryType: CredentialsTypeRepository;

  public constructor(
    private readonly credDefService: CredentialDefService,
    private readonly prismaService: PrismaService,
    private readonly restClient: RestClientService,
    private readonly natsClient: NatsClientService,
    private readonly tsaClient: TSAClientService,
    private readonly configService: ConfigService,
  ) {
    this.credentialRepository = new CredentialRepository(this.prismaService);
    this.credentialRepositoryType = new CredentialsTypeRepository(
      this.prismaService,
    );
  }

  public static readonly status = {
    OFFER_SENT: 'offer-sent',
    PROPOSAL_SENT: 'proposal-sent',
    REQUEST_RECEIVED: 'request-received',
    DONE: 'done',
    OFFER_RECEIVED: 'offer-received',
  };

  public static readonly principalMemberCredential =
    'principalMemberCredential';

  public static readonly connectionStatus = {
    TRUSTED: 'trusted',
  };

  public async createOfferCredential(
    credentialRequest: OfferCredentialDto,
    isTrustedConnectionRequired = false,
  ) {
    // TODO is it a correct conditions here? Should not be just isTrustedConnectionRequired?
    if (!isTrustedConnectionRequired) {
      const connection = await this.getConnectionByID(
        credentialRequest.connectionId,
      );

      logger.info(`connection ${JSON.stringify(connection)}`);

      if (connection?.status !== AttestationService.connectionStatus.TRUSTED) {
        return null;
      }
    }

    const agentUrl = this.configService.get('agent.AGENT_URL');
    const credentialRequestObj = { ...credentialRequest };

    const credDef = await this.findCredDef(
      credentialRequestObj.credentialDefinitionId,
    );

    const expirationDate = Utils.calculateExpiry(credDef.expiryHours);

    if (expirationDate) {
      credentialRequestObj.attributes.push({
        name: 'expirationDate',
        value: expirationDate.toString(),
      });
    }

    const schemaDetails = await this.getSchemaAndAttributesBySchemaIDFromLedger(
      credDef.schemaID,
    );
    logger.info(
      `schemaDetails?.attrNames?.length ${schemaDetails?.attrNames?.length}`,
    );
    logger.info(
      `credentialRequest.preview.attributes.length ${credentialRequest.attributes.length}`,
    );

    if (
      schemaDetails?.attrNames?.length !== credentialRequest.attributes.length
    ) {
      throw new BadRequestException('Invalid attributes');
    }

    logger.info(`offer-credential payload: ${credentialRequestObj}`);

    try {
      const credentialRequestPayload = {
        connectionId: credentialRequestObj.connectionId,
        credentialDefinitionId: credentialRequestObj.credentialDefinitionId,
        comment: credentialRequestObj.comment,
        preview: {
          '@type':
            'https://didcomm.org/issue-credential/1.0/credential-preview',
          attributes: credentialRequestObj.attributes,
        },
        autoAcceptCredential: credentialRequestObj.autoAcceptCredential,
      };

      logger.info(
        `***Offer Credential Payload***    ${JSON.stringify(
          credentialRequestPayload,
        )}`,
      );

      const responseData = await this.restClient.post(
        `${agentUrl}/credentials/offer-credential`,
        credentialRequestPayload,
      );
      logger.info(responseData);
      return responseData;
    } catch (error) {
      logger.error(JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    }
  }

  public async proposeCredential(connectionCreate: ProposeCredentialDto) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const connectionCreateObj = { ...connectionCreate };
    try {
      const responseData = await this.restClient.post(
        `${agentUrl}/credentials/propose-credential`,
        connectionCreateObj,
      );
      logger.info(responseData);
      return responseData;
    } catch (error) {
      logger.error(JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    }
  }

  public async acceptRequestCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');

    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-request`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  public async acceptProposeCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-proposal`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  public async acceptCredentialOffer(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-offer`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  public async acceptCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-credential`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  public async createCredential(credential: CredentialDto) {
    const connection = await this.getConnectionByID(credential.connectionId);

    const credDef = await this.findCredDef(credential.credDefId);

    logger.info(`credDef.expiryHours ${credDef.expiryHours}`);
    const expirationDate = Utils.calculateExpiry(credDef.expiryHours);
    logger.info(`expirationDate ${expirationDate}`);
    const tempCredential = credential;
    delete tempCredential.schemaId;

    return this.credentialRepository.createCredential({
      ...tempCredential,
      ...(expirationDate !== 'NA' && { expirationDate }),
      principalDid: connection.theirDid,
    });
  }

  public async getConnectionByID(connectionID: string) {
    const connection = await this.natsClient.getConnectionById(connectionID);
    return connection;
  }

  public async updateCredential(credential: CredentialDto) {
    return this.credentialRepository.updateCredential({
      where: { credentialId: credential.credentialId },
      data: {
        state: credential.state,
        updatedDate: new Date(),
      },
    });
  }

  public findCredentialById(credentialId: string) {
    const where: Prisma.CredentialWhereUniqueInput = { credentialId };
    return this.credentialRepository.findUniqueCredential({ where });
  }

  public findCredentialByThreadId(threadId: string) {
    const where: Prisma.CredentialWhereUniqueInput = { threadId };
    return this.credentialRepository.findUniqueCredential({ where });
  }

  public async findCredential(
    pageSize: number,
    page: number,
    isReceived: boolean,
    state?: string | false,
    credDefId?: string | false,
    createdDateStart?: string | false,
    createdDateEnd?: string | false,
    updatedDateStart?: string | false,
    updatedDateEnd?: string | false,
    expirationDateStart?: string | false,
    expirationDateEnd?: string | false,
    connectionId?: string | false,
    principalDid?: string | false,
  ) {
    let query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.CredentialWhereUniqueInput;
      where: Prisma.CredentialWhereInput;
      orderBy?: Prisma.CredentialOrderByWithRelationInput;
    } = {
      where: {},
    };

    if (state) {
      const states: string[] = state.split(',');
      query.where.state = { in: states };
    }
    if (credDefId) {
      query.where.credDefId = credDefId;
    }
    if (createdDateStart) {
      query.where.createdDate = { gte: createdDateStart };
    }
    if (createdDateEnd) {
      query.where.createdDate = Object.assign({}, query.where.createdDate, {
        lte: createdDateEnd,
      });
    }
    if (updatedDateStart) {
      query.where.updatedDate = { gte: updatedDateStart };
    }
    if (updatedDateEnd) {
      query.where.updatedDate = Object.assign({}, query.where.updatedDate, {
        lte: updatedDateEnd,
      });
    }
    if (expirationDateStart) {
      query.where.expirationDate = { gte: expirationDateStart };
    }
    if (expirationDateEnd) {
      query.where.expirationDate = Object.assign(
        {},
        query.where.expirationDate,
        { lte: expirationDateEnd },
      );
    }
    if (connectionId) {
      query.where.connectionId = connectionId;
    }
    if (principalDid) {
      query.where.principalDid = principalDid;
    }

    if (isReceived) {
      // TODO we need to check the case when first and second OCMs can re-use the same connection
      // and can issue credentials to each other. Will this function returns correct results for
      // every OCM?
      const receivedConnections =
        await this.natsClient.getReceivedConnections();
      if (
        Array.isArray(receivedConnections) &&
        receivedConnections.length > 0
      ) {
        const receivedConnectionIds = receivedConnections.map(
          (connection) => connection.connectionId,
        );

        query.where.connectionId = { in: receivedConnectionIds };
      }
    }

    query = { ...query, ...pagination(pageSize, page) };

    return this.credentialRepository.findCredential(query);
  }

  public async issueMemberCredentials(data: {
    status: string;
    connectionId: string;
    theirLabel: string;
    participantDID: string;
    theirDid: string;
    credDefId: string;
    attributes: { name: string; value: string }[];
    autoAcceptCredential: string;
  }) {
    logger.info(JSON.stringify(data));
    const payload: OfferCredentialDto = {
      connectionId: data.connectionId,
      credentialDefinitionId: data.credDefId,
      comment: 'Created',
      attributes: data.attributes,
      autoAcceptCredential: data.autoAcceptCredential,
    };
    logger.info(JSON.stringify(payload));

    const tsaResponse = await this.tsaClient.getPolicy(
      `${this.configService.get('TSA_URL')}/${
        TSAService.PRINCIPAL_CREDENTIAL_REQUEST
      }/1.0/evaluation`,
    );

    if (tsaResponse?.success && !tsaResponse.returnData) {
      throw new PreconditionFailedException('TSA ERROR!');
    }

    const result = await this.createOfferCredential(payload, true);
    logger.info(JSON.stringify(result));
    return result;
  }

  public getPrincipalMemberShipCredentials(data: { type: string }) {
    return this.credentialRepositoryType.findUniqueCredentialsType(data);
  }

  public async getSchemaAndAttributesBySchemaIDFromLedger(schemaID: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.get(
      `${agentUrl}/schemas/${schemaID}`,
    );

    if (!responseData?.id) {
      throw new BadRequestException('Invalid schema ID');
    }

    return responseData;
  }

  public updateSchemaByType(type: string, body: { schemaId: string }) {
    return this.credentialRepositoryType.updateCredentialsType({
      where: {
        type,
      },
      data: {
        schemaId: body.schemaId,
      },
    });
  }

  public async getIssueCredentials(data: GetIssueCredentialsDto) {
    return this.credentialRepository.findCredential({
      where: {
        connectionId: data.connectionId,
      },
    });
  }

  public async getCredentialInformation(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.get(
      `${agentUrl}/credentials/${credentialId}`,
    );

    if (!responseData?.id) {
      throw new BadRequestException('Invalid credential ID');
    }

    return responseData;
  }

  public async deleteCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.delete(
      `${agentUrl}/credentials/${credentialId}`,
    );

    await this.credentialRepository.deleteCredential({
      where: {
        credentialId,
      },
    });

    return responseData;
  }

  public createCredentialsType(credentialType: CredentialTypeDto) {
    return this.credentialRepositoryType.createCredentialsType({
      type: credentialType.type,
      schemaId: credentialType.schemaId,
    });
  }

  public connectionTrusted(connectionId: string) {
    return this.natsClient.connectionTrusted(connectionId);
  }

  public async findCredDef(credentialDefinitionId: string) {
    const credDefRes = await this.credDefService.findCredentialDefById(
      credentialDefinitionId,
    );

    if (!credDefRes[0]) {
      return {
        expiryHours: '-1',
        schemaID: '',
      };
    }

    return credDefRes[1][0];
  }

  public async findReceivedCredentials() {
    try {
      let result: Credential[] = [];
      const receivedConnections =
        await this.natsClient.getReceivedConnections();

      if (
        Array.isArray(receivedConnections) &&
        receivedConnections.length > 0
      ) {
        const receivedConnectionIds = receivedConnections.map(
          (connection) => connection.connectionId,
        );

        const credentials = await this.credentialRepository.findCredential({
          where: { connectionId: { in: receivedConnectionIds } },
        });
        [, result] = credentials;
      }

      return result;
    } catch (error) {
      logger.error(JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    }
  }
}
