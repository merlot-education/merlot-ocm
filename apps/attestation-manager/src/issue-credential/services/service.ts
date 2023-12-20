import {
  BadRequestException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import PrismaService from '@DB/prisma.service';
import logger from '@utils/logger';
import CredentialRepository from '@issueCredential/repository/credential.repository';
import CredentialDto from '@issueCredential/entities/credential.entity';
import { Credential, Prisma } from '@prisma/client';
import NatsClientService from '@src/client/nats.client';
import OfferCredentialDto from '@issueCredential/entities/entity';
import GetIssueCredentialsDto from '@src/issue-credential/entities/get-issue-credentials.dto';
import CredentialsTypeRepository from '@issueCredential/repository/credentialType.repository';
import pagination from '@utils/pagination';
import Utils from '@utils/common';
import CredentialDefService from '@src/credentialDef/services/service';
import RestClientService from '@src/client/rest.client';
import { ConfigService } from '@nestjs/config';
import CredentialTypeDto from '@issueCredential/entities/credentialType.entity';
import ProposeCredentialDto from '@issueCredential/entities/propose-credential.dto';
import TSAClientService from '@src/client/tsa.client';
import { TSAService } from '@src/common/constants';

@Injectable()
export default class AttestationService {
  private credentialRepository: CredentialRepository;

  private credentialRepositoryType: CredentialsTypeRepository;

  constructor(
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

  static readonly status = {
    OFFER_SENT: 'offer-sent',
    PROPOSAL_SENT: 'proposal-sent',
    REQUEST_RECEIVED: 'request-received',
    DONE: 'done',
    OFFER_RECEIVED: 'offer-received',
  };

  static readonly principalMemberCredential = 'principalMemberCredential';

  static readonly connectionStatus = {
    TRUSTED: 'trusted',
  };

  async createOfferCredential(
    credentialRequest: OfferCredentialDto,
    isTrustedConnectionRequired = false,
  ) {
    logger.info(`createOfferCredential entered`);
    // TODO is it a correct conditions here? Should not be just isTrustedConnectionRequired?
    if (!isTrustedConnectionRequired) {
      logger.info(`trusted connection not required`);
      logger.info(`connectionId ${credentialRequest.connectionId}`);
      logger.info(`credentialRequest ${credentialRequest}`);
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

  async proposeCredential(connectionCreate: ProposeCredentialDto) {
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

  async acceptRequestCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');

    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-request`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  async acceptProposeCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-proposal`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  async acceptCredentialOffer(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-offer`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  async acceptCredential(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/credentials/${credentialId}/accept-credential`,
      {},
    );
    logger.info(responseData);
    return responseData;
  }

  async createCredential(credential: CredentialDto) {
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

  async getConnectionByID(connectionID: string) {
    const connection = await this.natsClient.getConnectionById(connectionID);
    return connection;
  }

  async updateCredential(credential: CredentialDto) {
    return this.credentialRepository.updateCredential({
      where: { credentialId: credential.credentialId },
      data: {
        state: credential.state,
        updatedDate: new Date(),
      },
    });
  }

  findCredentialById(credentialId: string) {
    const where: Prisma.CredentialWhereUniqueInput = { credentialId };
    return this.credentialRepository.findUniqueCredential({ where });
  }

  findCredentialByThreadId(threadId: string) {
    const where: Prisma.CredentialWhereUniqueInput = { threadId };
    return this.credentialRepository.findUniqueCredential({ where });
  }

  async findCredential(
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
      // eslint-disable-next-line prefer-object-spread
      query.where.createdDate = Object.assign({}, query.where.createdDate, {
        lte: createdDateEnd,
      });
    }
    if (updatedDateStart) {
      query.where.updatedDate = { gte: updatedDateStart };
    }
    if (updatedDateEnd) {
      // eslint-disable-next-line prefer-object-spread
      query.where.updatedDate = Object.assign({}, query.where.updatedDate, {
        lte: updatedDateEnd,
      });
    }
    if (expirationDateStart) {
      query.where.expirationDate = { gte: expirationDateStart };
    }
    if (expirationDateEnd) {
      // eslint-disable-next-line prefer-object-spread
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

  async issueMemberCredentials(data: {
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

  getPrincipalMemberShipCredentials(data: { type: string }) {
    return this.credentialRepositoryType.findUniqueCredentialsType(data);
  }

  async getSchemaAndAttributesBySchemaIDFromLedger(schemaID: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.get(
      `${agentUrl}/schemas/${schemaID}`,
    );

    if (!responseData?.id) {
      throw new BadRequestException('Invalid schema ID');
    }

    return responseData;
  }

  updateSchemaByType(type: string, body: { schemaId: string }) {
    return this.credentialRepositoryType.updateCredentialsType({
      where: {
        type,
      },
      data: {
        schemaId: body.schemaId,
      },
    });
  }

  async getIssueCredentials(data: GetIssueCredentialsDto) {
    return this.credentialRepository.findCredential({
      where: {
        connectionId: data.connectionId,
      },
    });
  }

  async getCredentialInformation(credentialId: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.get(
      `${agentUrl}/credentials/${credentialId}`,
    );

    if (!responseData?.id) {
      throw new BadRequestException('Invalid credential ID');
    }

    return responseData;
  }

  async deleteCredential(credentialId: string) {
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

  createCredentialsType(credentialType: CredentialTypeDto) {
    return this.credentialRepositoryType.createCredentialsType({
      type: credentialType.type,
      schemaId: credentialType.schemaId,
    });
  }

  connectionTrusted(connectionId: string) {
    return this.natsClient.connectionTrusted(connectionId);
  }

  async findCredDef(credentialDefinitionId: string) {
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

  async findReceivedCredentials() {
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
