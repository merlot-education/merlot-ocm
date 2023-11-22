import type GetPresentProofsDto from '../entities/get-present-proofs.dto.js';
import type GetProofRequest from '../entities/get-proof-request.dto.js';
import type MembershipCredentialDto from '../entities/membership-credential.dto.js';
import type PresentationSubscriptionEndpointDto from '../entities/presentationSubscribeEndPoint.entity.js';
import type SendProofRequest from '../entities/send-proof-request.dto.js';
import type { Prisma } from '@prisma/client';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import PrismaService from '../../prisma/prisma.service.js';
import logger from '../../utils/logger.js';
import pagination from '../../utils/pagination.js';
import PresentationProofRepository from '../repository/presentationProof.respository.js';

@Injectable()
export default class PresentationProofsService {
  private presentationProofRepository;

  private agentURL;

  private didcommUrl;

  public constructor(
    private readonly natsClient: NatsClientService,
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly restClient: RestClientService,
    private readonly configService: ConfigService,
  ) {
    this.presentationProofRepository = new PresentationProofRepository(
      this.prismaService,
    );

    this.agentURL = this.configService.get('agent').agentUrl;
    this.didcommUrl = this.configService.get('agent').didcommUrl;
  }

  public getAppUrl() {
    return this.configService.get('APP_URL');
  }

  public static readonly connectionStatus = {
    TRUSTED: 'trusted',
  };

  public async findProofByProofRecordId(proof_record_id: string) {
    return this.restClient.get(`${this.agentURL}/proofs/${proof_record_id}`);
  }

  public async findProofPresentation(
    pageSize: number,
    page: number,
    proofRecordId?: string | false,
    connectionId?: string | false,
    credentialDefId?: string | false,
    schemaId?: string | false,
    theirDid?: string | false,
    status?: string | false,
    createdDateStart?: string | false,
    createdDateEnd?: string | false,
    updatedDateStart?: string | false,
    updatedDateEnd?: string | false,
  ) {
    let query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ProofWhereUniqueInput;
      where: Prisma.ProofWhereInput;
      orderBy?: Prisma.ProofOrderByWithRelationInput;
    } = {
      where: {},
    };

    if (status) {
      const states: string[] = status.split(',');
      query.where.status = { in: states };
    }
    if (proofRecordId) {
      query.where.proofRecordId = proofRecordId;
    }
    if (connectionId) {
      query.where.connectionId = connectionId;
    }
    if (credentialDefId) {
      query.where.credentialDefId = credentialDefId;
    }
    if (schemaId) {
      query.where.schemaId = schemaId;
    }
    if (theirDid) {
      query.where.theirDid = theirDid;
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

    query = { ...query, ...pagination(pageSize, page) };
    return this.presentationProofRepository.findProofPresentation(query);
  }

  public async createPresentationRequest(sendProofRequest: SendProofRequest) {
    const query: Prisma.ProofCreateInput = {
      proofRecordId: sendProofRequest.proofRecordId || '',
      connectionId: sendProofRequest.connectionId,
      status: sendProofRequest.status,
    };
    return this.presentationProofRepository.createPresentationProof(query);
  }

  public async getConnectionByID(connectionID: string) {
    const connection = await this.natsClient.getConnectionById(connectionID);

    return connection;
  }

  public async sendPresentationRequest(sendProofRequest: SendProofRequest) {
    const getPayloadRes =
      PresentationProofsService.createCommonPresentationRequestPaylod(
        sendProofRequest,
      );

    const proofRequestPayload = {
      comment: getPayloadRes.comment,
      connectionId: sendProofRequest.connectionId,
      // trace: true,
      autoAcceptProof: 'always',
      proofRequest: {
        name: 'Proof Request',
        version: '1.0',
        // nonce: getPayloadRes.nonce.toString(),
        requested_attributes: getPayloadRes.requested_attributes,
        requested_predicates: getPayloadRes.requested_predicates,
        ver: '1.0',
      },
    };

    logger.info(
      `proofRequestPayload for proof request ${JSON.stringify(
        proofRequestPayload,
      )}`,
    );

    let responseData = null;

    const getConnection = await this.getConnectionByID(
      sendProofRequest.connectionId || '',
    );

    if (
      getConnection?.status !==
      PresentationProofsService.connectionStatus.TRUSTED
    ) {
      responseData = {
        message: 'Connection is not trusted',
      };
      return responseData;
    }

    responseData = await this.restClient.post(
      `${this.agentURL}/proofs/request-proof`,
      proofRequestPayload,
    );

    responseData.theirDid = getConnection.theirDid;
    return responseData;
  }

  public static createCommonPresentationRequestPaylod(
    sendProofRequest: SendProofRequest,
  ) {
    const requestedAttributes: {
      [key: string]: {
        names: string[];
        restrictions: {
          schema_id?: string;
          cred_def_id?: string;
        }[];
      };
    } = {};
    const requestedPredicates: {
      [key: string]: Record<string, Array<object> | number>;
    } = {};
    const generateNonce: number = Math.floor(Math.random() * 10000000000000);
    const comment = sendProofRequest.comment ? sendProofRequest.comment : '';

    for (let i = 0; i < sendProofRequest.attributes.length; i += 1) {
      const attribute = sendProofRequest.attributes[i];
      const key = `${attribute.schemaId}_${attribute.credentialDefId}`;
      requestedAttributes[key] = requestedAttributes[key] || {
        names: [],
        restrictions: [],
      };

      if (attribute.schemaId) {
        requestedAttributes[key].restrictions[0] =
          requestedAttributes[key].restrictions[0] || {};
        requestedAttributes[key].restrictions[0].schema_id = attribute.schemaId;
      }

      if (attribute.credentialDefId) {
        requestedAttributes[key].restrictions[0] =
          requestedAttributes[key].restrictions[0] || {};
        requestedAttributes[key].restrictions[0].cred_def_id =
          attribute.credentialDefId;
      }

      if (attribute.attributeName) {
        requestedAttributes[key].names.push(attribute.attributeName);
      }
    }

    const payload = {
      comment,
      nonce: generateNonce.toString(),
      requested_attributes: Object.fromEntries(
        Object.entries(requestedAttributes).map(([, value], index) => [
          `additionalProp${index + 1}`,
          value,
        ]),
      ),
      requested_predicates: requestedPredicates,
    };
    return payload;
  }

  public async sendOutOfBandPresentationRequest(
    sendProofRequest: SendProofRequest,
  ) {
    const getPayloadRes =
      PresentationProofsService.createCommonPresentationRequestPaylod(
        sendProofRequest,
      );

    const proofRequestPayload = {
      comment: getPayloadRes.comment,
      autoAcceptProof: 'always',
      proofRequest: {
        name: 'Out Of Band Proof Request',
        version: '1.0',
        nonce: getPayloadRes.nonce.toString(),
        requested_attributes: getPayloadRes.requested_attributes,
        requested_predicates: getPayloadRes.requested_predicates,
        ver: '1.0',
      },
    };
    let responseData = null;

    responseData = await this.restClient.post(
      `${this.agentURL}/proofs/request-outofband-proof`,
      proofRequestPayload,
    );

    const shortRow = await this.presentationProofRepository.createShortUrl(
      responseData.message,
    );
    const appUrl = this.getAppUrl();
    responseData.messageShort = `${appUrl}/v1/url/${shortRow.id}`;

    return responseData;
  }

  public async sendPrincipalCredentialPresentationRequest(
    sendProofRequest: MembershipCredentialDto,
  ) {
    const requestedAttributes: {
      [key: string]: Record<string, Array<{ schema_id: string }>>;
    } = {};
    const requestedPredicates: {
      [key: string]: Record<string, Array<object> | number>;
    } = {};
    const generateNonce: number = Math.floor(Math.random() * 10000000000000);
    const comment = '';

    for (
      let index = 0;
      index < sendProofRequest.attributes.length;
      index += 1
    ) {
      const attributeElement = sendProofRequest.attributes[index];
      const attributeReferent = `additionalProp${index + 1}`;
      const keys = Object.keys(requestedAttributes);
      if (keys.length > 0) {
        keys.forEach((attr, i) => {
          if (
            attributeElement.schemaId &&
            requestedAttributes[attr].restrictions[i].schema_id ===
              attributeElement.schemaId
          ) {
            requestedAttributes[attr].names.push({
              schema_id: attributeElement.schemaId,
            });
          } else if (keys.length === i + 1) {
            requestedAttributes[attributeReferent] = {
              names: [attributeElement.attributeName],
              restrictions: [
                {
                  schema_id: attributeElement.schemaId || '',
                },
              ],
            } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
          }
        });
      } else {
        requestedAttributes[attributeReferent] = {
          names: [attributeElement.attributeName],
          restrictions: [
            {
              schema_id: attributeElement.schemaId || '',
            },
          ],
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }

    const proofRequestPayload = {
      comment,
      connectionId: sendProofRequest.connectionId,
      trace: true,
      proofRequest: {
        name: 'Membership Credential Proof Request',
        version: '1.0',
        nonce: generateNonce.toString(),
        requested_attributes: requestedAttributes,
        requested_predicates: requestedPredicates,
      },
    };

    let responseData = null;

    responseData = await this.restClient.post(
      `${this.agentURL}/proofs/request-proof`,
      proofRequestPayload,
    );

    return responseData;
  }

  public async updatePresentationStatus(getProofRequest: GetProofRequest) {
    const getRes =
      await this.presentationProofRepository.updatePresentationStatus({
        where: { proofRecordId: getProofRequest.id },
        data: {
          status: getProofRequest.state,
          updatedDate: new Date(),
        },
      });
    return getRes;
  }

  public async acceptPresentation(proof_record_id: string) {
    return lastValueFrom(
      this.httpService
        .post(`${this.agentURL}/proofs/${proof_record_id}/accept-presentation`)
        .pipe(map((response) => response.data)),
    );
  }

  public async acceptProofRequest(proofRecordId: string) {
    return lastValueFrom(
      this.httpService
        .post(`${this.agentURL}/proofs/${proofRecordId}/accept-request`)
        .pipe(map((response) => response.data)),
    );
  }

  public async deleteProofRequest(proofRecordId: string) {
    const response = lastValueFrom(
      this.httpService
        .delete(`${this.agentURL}/proofs/${proofRecordId}`)
        .pipe(map((response) => response.data)),
    );

    await this.presentationProofRepository.deleteProofRequest(proofRecordId);

    return response;
  }

  public async declineProofRequest(proofRecordId: string) {
    return lastValueFrom(
      this.httpService
        .post(`${this.didcommUrl}/v1/agent/proofs/declineRequest`, {
          data: [proofRecordId],
        })
        .pipe(map((response) => response.data)),
    );
  }

  public async getAllProofRequest(threadId: string) {
    const url = threadId
      ? `${this.agentURL}/proofs/?threadId=${threadId}`
      : `${this.agentURL}/proofs/`;
    return lastValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );
  }

  public async getSchemaById(schemaId: string) {
    const url = `${this.agentURL}/schemas/${schemaId}`;
    return lastValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );
  }

  public async getCredentialDefinitionsById(credentialDefinitionsId: string) {
    const url = `${this.agentURL}/credential-definitions/${credentialDefinitionsId}`;
    return lastValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );
  }

  public publishPresentationSubscriberEndpoint(
    data: PresentationSubscriptionEndpointDto,
  ) {
    this.natsClient.publishPresentation(data);
  }

  public getCredentialsTypeDetails(type: string) {
    return this.natsClient.getCredentialsTypeDetails(type);
  }

  public makeConnectionTrusted(connectionId: string) {
    return this.natsClient.makeConnectionTrusted(connectionId);
  }

  public async getPresentProofs(data: GetPresentProofsDto) {
    return this.presentationProofRepository.findProofPresentation({
      where: {
        connectionId: data.connectionId,
      },
    });
  }

  public async findUrlByShortUrlId(id: string) {
    return this.presentationProofRepository.getShortUrl(id);
  }
}
