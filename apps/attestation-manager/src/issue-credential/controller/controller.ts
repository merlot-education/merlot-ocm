import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import {
  Abstraction,
  NATSServices,
  PrismaErrorCode,
} from '../../common/constants.js';
import { ResponseType } from '../../common/response.js';
import CredentialDefService from '../../credentialDef/services/service.js';
import SchemasService from '../../schemas/services/service.js';
import UserInfoService from '../../userInfo/services/service.js';
import logger from '../../utils/logger.js';
import CredentialDto from '../entities/credential.entity.js';
import CredentialStateDto from '../entities/credential.state.entity.js';
import CredentialTypeDto from '../entities/credentialType.entity.js';
import OfferCredentialDto from '../entities/entity.js';
import GetIssueCredentialsDto from '../entities/get-issue-credentials.dto.js';
import GetCredentialParams from '../entities/get.credential.params.js';
import GetCredentialQuery from '../entities/get.credential.query.js';
import ProposeCredentialDto from '../entities/propose-credential.dto.js';
import UpdateSchemaIdByTypeDto from '../entities/updatecredDefIdByType.entity.js';
import AttestationService from '../services/service.js';

@ApiTags('Credentials')
@Controller()
export default class AttestationController {
  name: string;

  constructor(
    private readonly attestationService: AttestationService,
    private readonly credentialDefService: CredentialDefService,
    private readonly userInfoService: UserInfoService,
    private readonly schemaService: SchemasService,
    private configService: ConfigService,
  ) {}

  @Version(['1'])
  @ApiBody({ type: OfferCredentialDto })
  @Post('create-offer-credential')
  @ApiOperation({
    summary: 'Send credential offer to a connection',
    description:
      'This call provides the capability to offer credentials to a connection. You need to provide information about credential definition, connection and attributes which will be send to connection. Initial state of this is offer-sent (workflow is here https://github.com/hyperledger/aries-rfcs/tree/main/features/0036-issue-credential). This call returns information about this credential offer. From user perspective this call means that as organization (e.g. Faber university) I want to start issuing crendentials to student (Alice, holder)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential created successfully': {
            value: {
              statusCode: 201,
              message: 'Credential created successfully',
              data: {
                _tags: {},
                metadata: {
                  '_internal/indyCredential': {
                    credentialDefinitionId: '7KuDTpQh3GJ7Gp6',
                    schemaId: '7KuDTpQash2',
                  },
                },
                id: '61c5df9c',
                createdAt: '1970-01-01T12:07:57.388Z',
                state: 'offer-sent',
                connectionId: '12cd39de',
                threadId: '195e8ae3',
                offerMessage: {
                  '@type':
                    'https://didcomm.org/issue-credential/1.0/offer-credential',
                  '@id': '195e8da',
                  comment: 'asd',
                  credential_preview: {
                    '@type':
                      'https://didcomm.org/issue-credential/1.0/credential-preview',
                    attributes: [
                      {
                        name: 'firstName',
                        value: 'Lorem',
                      },
                      {
                        name: 'email',
                        value: 'lorem@example.com',
                      },
                      {
                        name: 'au',
                        value: 'ipsum',
                      },
                      {
                        name: 'expirationDate',
                        value:
                          'Wed Mar 01 2084 11:07:57 GMT+0000 (Coordinated Universal Time)',
                      },
                    ],
                  },
                  'offers~attach': [
                    {
                      '@id': 'libindy-cred-offer-0',
                      'mime-type': 'application/json',
                      data: {
                        base64: 'eyJzY2hlbWFf',
                      },
                    },
                  ],
                },
                credentialAttributes: [
                  {
                    name: 'attribute1',
                    value: 'testValue1',
                  },
                  {
                    name: 'attribute2',
                    value: 'testValue2',
                  },
                  {
                    name: 'attributeN',
                    value: 'testValueN',
                  },
                  {
                    name: 'expirationDate',
                    value:
                      'Wed Mar 01 2023 11:07:57 GMT+0000 (Coordinated Universal Time)',
                  },
                ],
                autoAcceptCredential: 'always',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'offer credentials required following attributes ( connectionId, credentialDefinitionId, attributes, autoAcceptCredential)',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'offer credentials required following attributes ( connectionId, credentialDefinitionId, attributes, autoAcceptCredential)':
            {
              value: {
                statusCode: 400,
                message:
                  'offer credentials required following attributes ( connectionId, credentialDefinitionId, attributes, autoAcceptCredential)',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Connection is not trusted',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection is not trusted': {
            value: {
              statusCode: 400,
              message: 'Connection is not trusted',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async createOfferCredential(
    @Body() connectionCreate: OfferCredentialDto,
    @Res() response: Response,
  ) {
    try {
      let res: ResponseType;

      if (
        !(
          connectionCreate.connectionId &&
          typeof connectionCreate.connectionId === 'string' &&
          connectionCreate.credentialDefinitionId &&
          typeof connectionCreate.credentialDefinitionId === 'string' &&
          Array.isArray(connectionCreate.attributes) &&
          connectionCreate.attributes.every(
            (i) =>
              typeof i.name === 'string' &&
              i.name.trim().length > 0 &&
              typeof i.value === 'string' &&
              i.value.trim().length > 0,
          ) &&
          connectionCreate.autoAcceptCredential &&
          typeof connectionCreate.autoAcceptCredential === 'string'
        )
      ) {
        res = {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Offer credentials required following attributes ( connectionId, credentialDefinitionId, attributes, autoAcceptCredential)',
        };
        return response.status(HttpStatus.BAD_REQUEST).send(res);
      }
      const OfferCredentialTemp: OfferCredentialDto = {
        connectionId: connectionCreate.connectionId,
        credentialDefinitionId: connectionCreate.credentialDefinitionId,
        attributes: connectionCreate.attributes,
        autoAcceptCredential: connectionCreate.autoAcceptCredential,
        comment: connectionCreate.comment,
      };

      const offerCredential =
        await this.attestationService.createOfferCredential(
          OfferCredentialTemp,
        );

      if (offerCredential) {
        res = {
          statusCode: HttpStatus.CREATED,
          message: 'Credential created successfully',
          data: offerCredential,
        };
      } else {
        response.status(HttpStatus.BAD_REQUEST);
        res = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Connection is not trusted',
        };
      }

      return response.send(res);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Version(['1'])
  @ApiBody({ type: ProposeCredentialDto })
  @Post('create-propose-credential')
  @ApiOperation({
    summary: 'Send credential proposal to a connection',
    description:
      'This call provides the capability to send propose crendential request to a connection. You need to provide information about credential definition, connection and attributes which you want to use for creating credentials. Initial state of this is proposal-sent (workflow is here https://github.com/hyperledger/aries-rfcs/tree/main/features/0036-issue-credential). This call returns information about this credential proposal. From user perspective this call means that as user (e.g. student) I want to ask organization (e.g. Faber university) to initiate issuing credentials for me using provided data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential proposed successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential proposed successfully': {
            value: {
              statusCode: 201,
              message: 'Credential proposed successfully',
              data: {
                _tags: {},
                metadata: {
                  '_internal/indyCredential': {
                    credentialDefinitionId:
                      '7KuDTpQh3GJ7Gp6kErpWvM:3:CL:39399:test-13-03',
                  },
                },
                id: 'c566907d',
                createdAt: '1970-01-01T00:00:09.383Z',
                state: 'proposal-sent',
                connectionId: '12cd39de',
                threadId: 'e271b1a0',
                proposalMessage: {
                  '@type':
                    'https://didcomm.org/issue-credential/1.0/propose-credential',
                  '@id': 'e271b1a0',
                  comment: 'asd',
                  credential_proposal: {
                    '@type':
                      'https://didcomm.org/issue-credential/1.0/credential-preview',
                    attributes: [
                      {
                        name: 'firstName',
                        value: 'TESTING',
                      },
                      {
                        name: 'email',
                        value: 'asd@asd.asd',
                      },
                      {
                        name: 'au',
                        value: 'level1',
                      },
                    ],
                  },
                  cred_def_id: '1234abcd',
                },
                credentialAttributes: [
                  {
                    name: 'firstName',
                    value: 'TESTING',
                  },
                  {
                    name: 'email',
                    value: 'asd@asd.asd',
                  },
                  {
                    name: 'au',
                    value: 'level1',
                  },
                ],
                autoAcceptCredential: 'never',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Connection is not trusted',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection is not trusted': {
            value: {
              statusCode: 400,
              message: 'Connection is not trusted',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async createProposeCredential(
    @Body() connectionCreate: ProposeCredentialDto,
    @Res() response: Response,
  ) {
    try {
      let res: ResponseType;
      const proposeCredential =
        await this.attestationService.proposeCredential(connectionCreate);

      if (proposeCredential) {
        res = {
          statusCode: HttpStatus.CREATED,
          message: 'Credential proposed successfully',
          data: proposeCredential,
        };
      } else {
        response.status(HttpStatus.BAD_REQUEST);
        res = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Connection is not trusted',
        };
      }

      return response.send(res);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Version(['1'])
  @Post('accept-request/:credentialId')
  @ApiOperation({
    summary: 'Accept credential request by credential id',
    description:
      'Accept a credential request as issuer (by sending a credential message) to the connection associated with the credential record.',
  })
  async acceptOfferCredential(@Param() params: { credentialId: string }) {
    try {
      const res: ResponseType = {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Accepted Credential Offer',
        data: await this.attestationService.acceptRequestCredential(
          params.credentialId,
        ),
      };
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Version(['1'])
  @Post('accept-proposal/:credentialId')
  @ApiOperation({
    summary: 'Accept credential proposal by credential id',
    description:
      'Accept a credential proposal as issuer (by sending a credential offer message) to the connection associated with the credential record.',
  })
  async acceptProposeCredential(@Param() params: { credentialId: string }) {
    try {
      if (!params.credentialId) {
        throw new BadRequestException('Invalid credential ID');
      }

      const res: ResponseType = {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Accepted Credential proposal',
        data: await this.attestationService.acceptProposeCredential(
          params.credentialId,
        ),
      };
      return res;
    } catch (error: unknown) {
      throw new HttpException(
        Reflect.get(error || {}, 'message') || 'Internal server error',
        Reflect.get(error || {}, 'status') || 500,
      );
    }
  }

  @Version(['1'])
  @Post('accept-offer/:credentialId')
  @ApiOperation({
    summary: 'Accept credential offer by credential id',
    description:
      'Accept a credential offer as holder (by sending a credential request message) to the connection associated with the credential record.',
  })
  async acceptCredentialOffer(@Param() params: { credentialId: string }) {
    try {
      if (!params.credentialId) {
        throw new BadRequestException('Invalid credential ID');
      }

      const res: ResponseType = {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Accepted Credential offer',
        data: await this.attestationService.acceptCredentialOffer(
          params.credentialId,
        ),
      };
      return res;
    } catch (error: unknown) {
      throw new HttpException(
        Reflect.get(error || {}, 'message') || 'Internal server error',
        Reflect.get(error || {}, 'status') || 500,
      );
    }
  }

  @Version(['1'])
  @Post('accept-credential/:credentialId')
  @ApiOperation({
    summary: 'Accept credentials by credential id',
    description:
      'Accept a credential as holder (by sending a credential acknowledgement message) to the connection associated with the credential record.',
  })
  async acceptCredential(@Param() params: { credentialId: string }) {
    try {
      if (!params.credentialId) {
        throw new BadRequestException('Invalid credential ID');
      }

      const res: ResponseType = {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Accepted Credential offer',
        data: await this.attestationService.acceptCredential(
          params.credentialId,
        ),
      };
      return res;
    } catch (error: unknown) {
      throw new HttpException(
        Reflect.get(error || {}, 'message') || 'Internal server error',
        Reflect.get(error || {}, 'status') || 500,
      );
    }
  }

  // @Version(['1'])
  // @Post('credentials')
  @EventPattern({
    endpoint: `${Abstraction.NATS_ENDPOINT}/${Abstraction.CREDENTIAL_STATE_CHANGED}`,
  })
  async webHookCredentials(body: { credentialRecord: CredentialStateDto }) {
    const credentialsCreate = body.credentialRecord;
    logger.info(
      `credentials webhook call data ${JSON.stringify(credentialsCreate)}`,
    );
    const credentialObj: CredentialDto = {
      credentialId: credentialsCreate.id,
      state: credentialsCreate.state,
      connectionId: credentialsCreate.connectionId,
      credDefId:
        credentialsCreate.metadata['_internal/indyCredential']
          .credentialDefinitionId,
      schemaId: credentialsCreate.metadata['_internal/indyCredential'].schemaId,
      threadId: credentialsCreate.threadId,
    };
    let res: ResponseType;

    if (
      credentialsCreate.state === AttestationService.status.OFFER_SENT ||
      credentialsCreate.state === AttestationService.status.PROPOSAL_SENT ||
      credentialsCreate.state === AttestationService.status.OFFER_RECEIVED
    ) {
      res = {
        statusCode: HttpStatus.CREATED,
        message: 'Credentials Offered',
        data: await this.attestationService.createCredential(credentialObj),
      };
    } else {
      const result: CredentialDto =
        await this.attestationService.updateCredential(credentialObj);

      if (
        credentialsCreate.state === AttestationService.status.REQUEST_RECEIVED
      ) {
        res = {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Credentials request auto accepted',
          data: await this.attestationService.acceptRequestCredential(
            result.credentialId,
          ),
        };
        return res;
      }
      const credentialsType =
        await this.attestationService.getPrincipalMemberShipCredentials({
          type: AttestationService.principalMemberCredential,
        });
      if (
        credentialsType?.schemaId === credentialObj.schemaId &&
        credentialsCreate.state === AttestationService.status.DONE
      ) {
        this.attestationService.connectionTrusted(credentialObj.connectionId);
      }
      res = {
        statusCode: HttpStatus.OK,
        message: 'Credentials status Updated',
        data: result,
      };
    }

    return res;
  }

  // TODO: example values
  @Version(['1'])
  @Get('credential-info/:id')
  @ApiOperation({
    summary: 'Fetch credential information by credential id',
    description:
      'This call provides the capability to get credential information by credential id. This call returns a credential record (CredentialRecord type with fields connectionId, threadId, credentialId, state, autoAcceptCredential, errorMessage, proposalMessage, offerMessage, requestMessage, credentialMessage, credentialAttributes, linkedAttachments and others). This request get credential data directly from agent, so you can use this endpoint to get some additional info which is not presented in /v1/credential/{id}',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential information fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential information fetched successfully': {
            value: {},
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getCredentialInfo(
    @Param() params: GetCredentialParams,
    @Res() response: Response,
  ) {
    let res: ResponseType;

    try {
      const result = await this.attestationService.getCredentialInformation(
        params.id,
      );

      res = {
        statusCode: HttpStatus.OK,
        message: 'Agent responded',
        data: result,
      };

      // if (result) {
      //   if (result[0]) {
      //     res = {
      //       statusCode: HttpStatus.OK,
      //       message: 'Credential information fetched successfully',
      //       data: {
      //         count: result[0],
      //         records: result[1],
      //       },
      //     };
      //   } else {
      //     response.status(HttpStatus.NOT_FOUND);
      //     res = {
      //       statusCode: HttpStatus.NOT_FOUND,
      //       message: 'No Data found',
      //     };
      //   }
      // } else {
      //   response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      //   res = {
      //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //     message: 'Something went wrong please try again',
      //   };
      // }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Version(['1'])
  @Delete('delete-credential/:id')
  @ApiOperation({
    summary: 'Delete credential by id',
    description:
      'This call provides the capability to delete credential (request/offer/proposal) by provided credential id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential deleted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential deleted successfully': {
            value: {
              statusCode: HttpStatus.OK,
              message: 'Credential deleted successfully',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async deleteCredential(
    @Param() params: GetCredentialParams,
    @Res() response: Response,
  ) {
    let res: ResponseType;

    try {
      const result = await this.attestationService.deleteCredential(params.id);

      if (result.reason || result.message) {
        res = {
          statusCode: result.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: result.message || result.reason,
        };
      } else {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Credential deleted successfully',
          data: result,
        };
      }

      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Version(['1'])
  @Get('credential')
  @ApiOperation({
    summary: 'Fetch a list of credentials',
    description:
      'This call provides the capability to search credentials by using pagination and filter parameters to select credentials. This call returns a list of credentials and overall count of records. Filter supports following parameters: page, pageSize, isReceived, threadId, state, credDefId, createdDateStart, createdDateEnd, updatedDateStart, updatedDateEnd, expirationDateStart, expirationDateEnd, connectionId, principalDid',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'isReceived', required: false })
  @ApiQuery({ name: 'threadId', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'credDefId', required: false })
  @ApiQuery({ name: 'createdDateStart', required: false })
  @ApiQuery({ name: 'createdDateEnd', required: false })
  @ApiQuery({ name: 'updatedDateStart', required: false })
  @ApiQuery({ name: 'updatedDateEnd', required: false })
  @ApiQuery({ name: 'expirationDateStart', required: false })
  @ApiQuery({ name: 'expirationDateEnd', required: false })
  @ApiQuery({ name: 'connectionId', required: false })
  @ApiQuery({ name: 'principalDid', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential fetched successfully',
              data: {
                count: 87,
                records: [
                  {
                    id: '14875384',
                    credentialId: 'c566907d',
                    credDefId: '7KuDTpQh3GJ',
                    threadId: 'e271b1a0',
                    state: 'proposal-sent',
                    principalDid: 'KGaeQVaF',
                    connectionId: '12cd39de',
                    createdDate: '1970-01-01T00:00:09.761Z',
                    updatedDate: '1970-01-01T00:00:09.761Z',
                    expirationDate: '2070-01-01T00:00:09.756Z',
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Data found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found': {
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getCredentialList(
    @Query() query: GetCredentialQuery,
    @Res() response: Response,
  ) {
    let res: ResponseType;

    try {
      if (query.threadId) {
        const result = await this.attestationService.findCredentialByThreadId(
          query.threadId,
        );
        if (result) {
          res = {
            statusCode: HttpStatus.OK,
            message: 'Credential fetch successfully',
            data: {
              count: 1,
              results: [result],
            },
          };
        } else {
          response.status(HttpStatus.NOT_FOUND);
          res = {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No Data found',
          };
        }
      } else {
        const result = await this.attestationService.findCredential(
          query.pageSize ? parseInt(query.pageSize, 10) : 10,
          query.page ? parseInt(query.page, 10) : 0,
          query.isReceived === 'true',
          query.state ? query.state : false,
          query.credDefId ? query.credDefId : false,
          query.createdDateStart ? query.createdDateStart : false,
          query.createdDateEnd ? query.createdDateEnd : false,
          query.updatedDateStart ? query.updatedDateStart : false,
          query.updatedDateEnd ? query.updatedDateEnd : false,
          query.expirationDateStart ? query.expirationDateStart : false,
          query.expirationDateEnd ? query.expirationDateEnd : false,
          query.connectionId ? query.connectionId : false,
          query.principalDid ? query.principalDid : false,
        );

        if (result) {
          if (result[0]) {
            res = {
              statusCode: HttpStatus.OK,
              message: 'Credential fetch successfully',
              data: {
                count: result[0],
                records: result[1],
              },
            };
          } else {
            response.status(HttpStatus.NOT_FOUND);
            res = {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            };
          }
        } else {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Something went wrong please try again',
          };
        }
      }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Version(['1'])
  @Get('credential/:id')
  @ApiOperation({
    summary: 'Fetch credential by id',
    description:
      'This call provides the capability to get credential data by providing credential id. The credential definition data is the same which is returned from /v1/credential endpoint and contains generic information about credential like credentialId, credDefId, threadId, state, principalDid, connectionId, createdDate, updatedDate, expirationDate',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential fetched successfully',
              data: {
                id: '14875384',
                credentialId: 'c566907d',
                credDefId: '7KuDTpQh3GJ',
                threadId: 'e271b1a0',
                state: 'proposal-sent',
                principalDid: 'KGaeQVaF',
                connectionId: '12cd39de',
                createdDate: '1970-01-01T00:00:09.761Z',
                updatedDate: '1970-01-01T00:00:09.761Z',
                expirationDate: '2070-01-01T00:00:09.756Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Data found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found': {
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getCredential(
    @Param() params: GetCredentialParams,
    @Query() query: GetCredentialQuery,
    @Res() response: Response,
  ) {
    let res: ResponseType;

    try {
      const result = await this.attestationService.findCredentialById(
        params.id,
      );
      if (result) {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Credential fetched successfully',
          data: result,
        };
      } else {
        response.status(HttpStatus.NOT_FOUND);
        res = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Data found',
        };
      }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/offerMemberShipCredentials`,
  })
  async offerMemberShipCredentials(data: {
    status: string;
    connectionId: string;
    theirLabel: string;
    participantDID: string;
    theirDid: string;
  }) {
    logger.info('Inside OfferMembership Credential');
    try {
      const credentialsType =
        await this.attestationService.getPrincipalMemberShipCredentials({
          type: AttestationService.principalMemberCredential,
        });
      logger.info(JSON.stringify(credentialsType));
      if (credentialsType) {
        /* Husky restructure this line every time
         and lint does not allow more then 100 characters on same line.
         */

        const [, [credentialDef]] =
          await this.credentialDefService.findCredentialDefBySchemaIdDesc({
            schemaID: credentialsType?.schemaId,
          });
        logger.info(`credentialDef ${JSON.stringify(credentialDef)}`);

        const schemaDetails = await this.schemaService.findBySchemaId(
          credentialDef.schemaID,
        );

        const attributes: { name: string; value: string }[] = [];

        const schemaAttributes = schemaDetails?.attribute;

        const userDetails = await this.userInfoService.getUserInfo(
          data.connectionId,
        );

        const userInfo = userDetails
          ? JSON.parse(JSON.stringify(userDetails.userInfo))
          : {
              issuerDID: data.participantDID,
              subjectDID: data.theirDid,
              email: data.theirLabel,
            };

        if (userInfo && schemaAttributes && schemaAttributes.length > 0) {
          userInfo.issuerDID = data.participantDID;
          userInfo.subjectDID = data.theirDid;

          for (let i = 0; i < schemaAttributes.length; i += 1) {
            const attribute: Record<string, string> = schemaAttributes[i];

            if (attribute.name in userInfo) {
              attributes.push({
                name: attribute.name,
                value: userInfo[attribute.name],
              });
            } else if (attribute.name !== 'expirationDate') {
              attributes.push({
                name: attribute.name,
                value: attribute.name === 'email' ? data.theirLabel : 'NA',
              });
            }
          }
        }

        await this.userInfoService.updateUserInfo({
          connectionId: data.connectionId,
          credentialDefinitionId: credentialDef.credDefId,
          status: 'issued',
          userInfo: {},
        });

        const res: ResponseType = {
          statusCode: HttpStatus.OK,
          message: 'Membership Credentials issued.',
          data: await this.attestationService.issueMemberCredentials({
            ...data,
            credDefId: credentialDef.credDefId,
            attributes,
            autoAcceptCredential: userDetails?.autoAcceptCredential as string,
          }),
        };
        logger.info(JSON.stringify(res));
        return res;
      }
      const res: ResponseType = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Schema Id Not defined please connect admin.',
      };
      return res;
    } catch (error) {
      logger.error(error);
      let res: ResponseType;

      if (error instanceof PreconditionFailedException) {
        res = {
          statusCode: error.getStatus(),
          message: error?.message || 'Something went wrong. Please try again',
        };
      } else {
        res = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong. Please try again',
        };
      }
      return res;
    }
  }

  @Patch('updateSchemaIdByType')
  @ApiQuery({ name: 'type', required: true })
  @ApiBody({ type: UpdateSchemaIdByTypeDto })
  @ApiOperation({
    summary: 'Update schemaId in CredentialsType',
    description:
      'This call provides the capability to update mapping between schema and type.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'schemaId updated in CredentialsType',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'schemaId updated in CredentialsType': {
            value: {
              statusCode: 200,
              message: 'schemaId updated in CredentialsType',
              data: {
                id: 'd6ef2d010',
                type: 'principalMemberCredential',
                schemaId: '7KuDTpQh3GJ7Gp6kErpWvM:2:principalTestSchema:1.0',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Not Found': {
            value: {
              status: HttpStatus.NOT_FOUND,
              message: 'Not Found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async updateSchemaIdByType(
    @Body() body: { schemaId: string },
    @Query() query: { type: string },
  ) {
    try {
      const res: ResponseType = {
        statusCode: HttpStatus.OK,
        message: 'schemaId updated in CredentialsType',
        data: await this.attestationService.updateSchemaByType(
          query.type,
          body,
        ),
      };
      return res;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCode.RECORD_NOT_FOUND
      ) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Post('credentialType')
  @ApiOperation({
    summary: 'Create new CredentialType',
    description:
      'This call provides the capability to create mapping between schema and type.',
  })
  @ApiBody({ type: CredentialTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'schemaId added in CredentialsType of membership credentials.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'schemaId added in CredentialsType of membership credentials.': {
            value: {
              statusCode: 201,
              message:
                'schemaId added in CredentialsType of membership credentials.',
              data: {
                id: 'd6ef2d01',
                type: 'principalMemberCredential',
                schemaId: '7KuDTpQh3GJ7Gp6kErpWvM:2:principalTestSchema:1.0',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async createCredentialType(@Body() body: CredentialTypeDto) {
    try {
      const res: ResponseType = {
        statusCode: HttpStatus.CREATED,
        message: 'schemaId added in CredentialsType of membership credentials.',
        data: await this.attestationService.createCredentialsType(body),
      };
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/getIssueCredentials`,
  })
  async getIssueCredentials(data: GetIssueCredentialsDto) {
    return this.attestationService.getIssueCredentials(data);
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/getCredentialsTypeDetails`,
  })
  async getCredentialsTypeDetails(data: { type: string }) {
    let res;

    const credentialsType =
      await this.attestationService.getPrincipalMemberShipCredentials(data);

    if (credentialsType?.schemaId) {
      const getSchema =
        await this.attestationService.getSchemaAndAttributesBySchemaIDFromLedger(
          credentialsType.schemaId,
        );
      const attributes: Array<{ name: string }> = [];
      getSchema.attrNames.forEach((attr: string) => {
        attributes.push({ name: attr });
      });

      res = {
        schema: {
          schemaID: credentialsType?.schemaId,
          attribute: attributes,
        },
      };
    }
    return res;
  }

  @Get('credentialType')
  @ApiOperation({
    summary: 'Fetch CredentialType contains schemaId and attributes by type',
    description:
      'This call provides the capability to get schema id and its attributes by provided type',
  })
  @ApiQuery({ name: 'type', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential type retrieved successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential type retrieved successfully': {
            value: {
              schema: {
                schemaID: '7KuDTpQh3GJ7Gp6kErpWvM:2:principalTestSchema:1.0',
                attribute: [
                  'prcPreferredUsername',
                  'issuerDID',
                  'prcGender',
                  'prcBirthdate',
                  'expirationDate',
                  'prcLastName',
                  'prcFirstName',
                  'email',
                  'prcMiddleName',
                  'subjectDID',
                  'auth_time',
                  'email_verified',
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential type not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential type not found': {
            value: undefined,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getCredentialTypeAttributes(@Query() query: { type: string }) {
    let res;

    const credentialsType =
      await this.attestationService.getPrincipalMemberShipCredentials(query);
    if (credentialsType?.schemaId) {
      const schemaDetails: {
        ver: string;
        id: string;
        name: string;
        version: string;
        attrNames: string[];
        seqNo: number;
      } =
        await this.attestationService.getSchemaAndAttributesBySchemaIDFromLedger(
          credentialsType.schemaId,
        );
      res = {
        schema: {
          schemaID: credentialsType?.schemaId,
          attribute: schemaDetails.attrNames,
        },
      };
    }
    return res;
  }
}
