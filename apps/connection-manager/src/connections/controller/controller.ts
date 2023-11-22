import type ResponseType from '../../common/response.js';
import type ConnectionStateDto from '../entities/connectionStateDto.entity.js';
import type ConnectionSubscriptionEndpointDto from '../entities/connectionSubscribeEndPoint.entity.js';
import type ConnectionDto from '../entities/entity.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  Abstraction,
  NATSServices,
  RECEIVED_CONNECTION_ALIAS,
} from '../../common/constants.js';
import logger from '../../utils/logger.js';
import AcceptConnectionInvitationBody from '../entities/AcceptConnectionInvitationBody.js';
import ConnectionCreateInvitationDto from '../entities/connectionCreateInvitationDto.entity.js';
import ConnectionsService from '../services/service.js';

@ApiTags('Connections')
@Controller()
export default class ConnectionsController {
  public constructor(private readonly connectionsService: ConnectionsService) {}

  @MessagePattern({
    endpoint: `${Abstraction.NATS_ENDPOINT}/${Abstraction.CONNECTION_STATE_CHANGED}`,
  })
  public async createConnection(body: {
    connectionRecord: ConnectionStateDto;
  }) {
    const connection = body.connectionRecord;

    const connectionObj: ConnectionDto = {
      connectionId: connection.id ? connection.id : '',
      status: connection.state ? connection.state : '',
      participantDid: connection.did ? connection.did : '',
      theirDid: connection.theirDid ? connection.theirDid : '',
      theirLabel: connection.theirLabel ? connection.theirLabel : '',
      isReceived: connection.alias === RECEIVED_CONNECTION_ALIAS,
    };

    /**
     * Sent Connection updates to subscriber
     */
    const connectionSubscriptionEndpointDto: ConnectionSubscriptionEndpointDto =
      {
        connectionId: connectionObj.connectionId,
        status: connectionObj.status,
      };
    this.connectionsService.publishConnectionSubscriberEndpoint(
      connectionSubscriptionEndpointDto,
    );

    if (connection.state === ConnectionsService.status.INVITED) {
      connectionObj.invitation = {
        serviceEndpoint: connection.invitation.serviceEndpoint,
      };
      const res: ResponseType = {
        statusCode: HttpStatus.CREATED,
        message: 'Connection established successfully',
        data: await this.connectionsService.createConnections(connectionObj),
      };
      return res;
    }
    if (connection.state === ConnectionsService.status.COMPLETE) {
      logger.info('connection is in complete state');
      if (
        connection.alias === RECEIVED_CONNECTION_ALIAS ||
        connection.alias === ConnectionsService.connectionAlias.TRUST
      ) {
        connectionObj.status = ConnectionsService.status.TRUSTED;
      } else {
        const resConnection = await this.connectionsService.getConnectionByID(
          connection.id,
        );

        if (resConnection) {
          if (connection.alias === ConnectionsService.connectionAlias.MEMBER) {
            logger.info(
              `connection.alias ===${ConnectionsService.connectionAlias.MEMBER}`,
            );
            await this.connectionsService.sendConnectionStatusToPrincipal(
              connection.state,
              connection.id,
              connection.theirLabel,
              connection.did,
              connection.theirDid,
            );
          }

          if (
            connection.alias === ConnectionsService.connectionAlias.SUBSCRIBER
          ) {
            await this.connectionsService.sendMembershipProofRequestToProofManager(
              connection.id,
            );
          }
        }
      }
    }

    const res: ResponseType = {
      statusCode: HttpStatus.OK,
      message: 'Connection status Updated successfully',
      data: await this.connectionsService.updateStatusByConnectionId(
        connectionObj,
      ),
    };

    return res;
  }

  @Version(['1'])
  @ApiBody({ type: ConnectionCreateInvitationDto })
  @Post('invitation-url')
  @ApiOperation({
    summary: 'Create new connection invitation',
    description:
      "This call provides the capability to create new connection invitation by providing alias parameter for taht connection in the body of request. Alias can be one of value: trust/subscriber/trust. This call returns  an object contains three fields. invitationUrl, invitationUrlShort, invitation object and connection object. You can use invitationUrlShort or invitationUrl to create QR code which can be scanned by PCM. It's better to use invitationUrlShort because long string of invitationUrl replaced with short id and QR code can be displayed properly",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connection created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection created successfully': {
            value: {
              statusCode: 200,
              message: 'Connection created successfully',
              data: {
                invitationUrl:
                  'https://serviceEndpointUrl.com:443/ocm/didcomm?c_i=eyJAdHlwZSI6Imh0dHBzOi',
                invitation: {
                  '@type': 'https://didcomm.org/connections/1.0/invitation',
                  '@id': 'efe3fe97',
                  label: 'ssi-abstraction-agent',
                  recipientKeys: ['8iT6AAmbj9P'],
                  serviceEndpoint:
                    'https://serviceEndpointUrl.com:443/ocm/didcomm',
                  routingKeys: [],
                },
                connection: {
                  _tags: {},
                  metadata: {},
                  id: '507de3ab',
                  createdAt: '1970-01-01T00:00:00.358Z',
                  did: 'F9xYT1m',
                  didDoc: {
                    '@context': 'https://w3id.org/did/v1',
                    publicKey: [
                      {
                        id: 'F9xYT1m',
                        controller: 'F9xYT1m',
                        type: 'Ed25519VerificationKey2018',
                        publicKeyBase58: '8iT6AAmbj9P',
                      },
                    ],
                    service: [
                      {
                        id: 'F9xYT1m#IndyAgentService',
                        serviceEndpoint:
                          'https://serviceEndpointUrl.com:443/ocm/didcomm',
                        type: 'IndyAgent',
                        priority: 0,
                        recipientKeys: ['8iT6AAmbj9P'],
                        routingKeys: [],
                      },
                    ],
                    authentication: [
                      {
                        publicKey: 'F9xYT1m',
                        type: 'Ed25519SignatureAuthentication2018',
                      },
                    ],
                    id: 'F9xYT1m',
                  },
                  verkey: '8iT6AAmbj9P',
                  state: 'invited',
                  role: 'inviter',
                  alias: 'trust',
                  invitation: {
                    '@type': 'https://didcomm.org/connections/1.0/invitation',
                    '@id': 'efe3fe97',
                    label: 'ssi-abstraction-agent',
                    recipientKeys: ['8iT6AAmbj9P'],
                    serviceEndpoint:
                      'https://serviceEndpointUrl.com:443/ocm/didcomm',
                    routingKeys: [],
                  },
                  multiUseInvitation: false,
                },
                invitationUrlShort:
                  'https://serviceEndpointUrl.com/ocm/connection/v1/url/1234abc',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Alias must be provided',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Alias must be provided': {
            value: {
              statusCode: 400,
              message: 'Alias must be provided',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agent Data not found.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Agent Data not found.': {
            value: {
              statusCode: 400,
              message: 'Agent Data not found.',
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'alias', required: true })
  public async createConnectionInvitation(
    @Body() connectionCreate: ConnectionCreateInvitationDto,
    @Query() query: { alias: string },
    @Res() response: Response,
  ) {
    logger.info(JSON.stringify(query));
    let res: ResponseType;

    if (
      !(
        query.alias === ConnectionsService.connectionAlias.MEMBER ||
        query.alias === ConnectionsService.connectionAlias.SUBSCRIBER ||
        query.alias === ConnectionsService.connectionAlias.TRUST
      )
    ) {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Alias must be provided',
      };
      return response.send(res);
    }
    const createConnectionPayload = {
      ...connectionCreate,
      alias: query.alias,
    };
    const result = await this.connectionsService.createInvitationURL(
      createConnectionPayload,
    );
    if (result) {
      res = {
        statusCode: HttpStatus.OK,
        message: 'Connection created successfully',
        data: result,
      };
      return response.send(res);
    }
    response.status(HttpStatus.NOT_FOUND);
    res = {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Agent Data not found.',
    };

    return response.send(res);
  }

  @Version(['1'])
  @Get('url/:id')
  @ApiOperation({
    summary: 'Get full url from short url id',
    description: 'Get full url from short url id',
  })
  @ApiExcludeEndpoint()
  public async redirectToConnectionUrl(
    @Param() params: { id: string },
    @Res() response: Response,
  ) {
    const result = await this.connectionsService.findConnectionByShortUrlId(
      params.id,
    );
    if (!result) {
      throw new Error('Not found');
    }
    response.writeHead(302, {
      location: result.connectionUrl,
    });
    return response.end();
  }

  @Version(['1'])
  @Get('connection-information')
  @ApiOperation({
    summary: 'Fetch connection information by id or did',
    description:
      'This call provides the capability to get information about connection by connectionId or did. This call returns issued credentials and requested proof to that connection',
  })
  @ApiQuery({ name: 'connectionId', required: false })
  @ApiQuery({ name: 'did', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connection information fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection information fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Connection information fetched successfully',
              data: {
                records: {
                  issueCredentials: [
                    {
                      id: '6a6ee15d',
                      credentialId: '624a76fd',
                      credDefId: '8y8oycXjn',
                      threadId: '9f95a52a',
                      state: 'done',
                      principalDid: 'KGaeQVa',
                      connectionId: '12cd39de',
                      createdDate: '1970-01-01T00:00:00.149Z',
                      updatedDate: '1970-01-01T00:00:00.467Z',
                      expirationDate: null,
                    },
                  ],
                  presentProofs: [],
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'connection ID / DID must be provided',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'connection ID / DID must be provided': {
            value: {
              statusCode: 400,
              message: 'connection ID / DID must be provided',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid connection ID / DID',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid connection ID / DID': {
            value: {
              statusCode: 400,
              message: 'Invalid connection ID / DID',
            },
          },
        },
      },
    },
  })
  public async getConnectionInformationRequest(
    @Query() query: { connectionId: string; did: string },
    @Res() response: Response,
  ) {
    let res: ResponseType;

    if (!query.connectionId && !query.did) {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'connection ID / DID must be provided',
      };
      return response.json(res);
    }

    const result =
      await this.connectionsService.getConnectionInformationRequest(
        query.connectionId || '',
        query.did || '',
      );

    if (!result) {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid connection ID / DID',
      };
      return response.json(res);
    }

    res = {
      statusCode: HttpStatus.OK,
      message: 'Connection information fetched successfully',
      data: {
        records: result,
      },
    };
    return response.json(res);
  }

  @Version(['1'])
  @Get('connections')
  @ApiOperation({
    summary: 'Fetch list of connections',
    description:
      'This call provides the capability to search connections by using pagination and filter parameters. This call returns a list of connections and overall count of records. This endpoint supports followinng query filter parameters: participantDID, status, pageSize, page',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'participantDID', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connections fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connections fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Connections fetched successfully',
              data: {
                count: 1,
                records: [
                  {
                    id: '089e1b95',
                    connectionId: 'e7361a1b',
                    status: 'invited',
                    participantDid: 'Kv6NS9y',
                    theirDid: '',
                    theirLabel: '',
                    createdDate: '1970-01-01T00:00:00.617Z',
                    updatedDate: '1970-01-01T00:00:00.617Z',
                    isActive: false,
                    isReceived: false,
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
              statusCode: 404,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  public async getConnectionLists(
    @Param() params: { connectionId: string },
    @Query()
    query: {
      participantDID?: string;
      pageSize?: string;
      page?: string;
      status?: string;
    },
    @Res() response: Response,
  ) {
    let res: ResponseType;

    const result = await this.connectionsService.findConnections(
      query.pageSize ? parseInt(query.pageSize, 10) : 10,
      query.page ? parseInt(query.page, 10) : 0,
      query.status ? query.status : false,
      params?.connectionId ? params.connectionId : undefined,
      query.participantDID,
    );

    if (Array.isArray(result) && result[0] > 0) {
      res = {
        statusCode: HttpStatus.OK,
        message: 'Connections fetched successfully',
        data: {
          count: result[0],
          records: result[1],
        },
      };
      return response.json(res);
    }

    if (result && !Array.isArray(result) && result.isActive) {
      res = {
        statusCode: HttpStatus.OK,
        message: 'Connections fetched successfully',
        data: {
          records: result,
        },
      };
      return response.json(res);
    }

    response.status(HttpStatus.NOT_FOUND);
    res = {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No Data found',
    };
    return response.json(res);
  }

  @Version(['1'])
  @Get('connections/:connectionId')
  @ApiOperation({
    summary: 'Fetch connection by id',
    description:
      'This call provides the capability to get connection data by providing connectionId. The connection data is the same which is returned from /v1/connections endpoint and contains generic information about connection like connectionId, status, dids and so on.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connections fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connections fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Connections fetched successfully',
              data: {
                count: 1,
                records: [
                  {
                    id: '089e1b95',
                    connectionId: 'e7361a1b',
                    status: 'invited',
                    participantDid: 'Kv6NS9y',
                    theirDid: '',
                    theirLabel: '',
                    createdDate: '1970-01-01T00:00:00.617Z',
                    updatedDate: '1970-01-01T00:00:00.617Z',
                    isActive: false,
                    isReceived: false,
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
              statusCode: 404,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  public async getConnection(
    @Param() params: { connectionId: string },
    @Res() response: Response,
  ) {
    return this.getConnectionLists(params, {}, response);
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/getConnectionById`,
  })
  public async getConnectionById(data: { connectionId: string }) {
    const result = await this.connectionsService.findConnections(
      -1,
      -1,
      false,
      data.connectionId,
    );
    return result;
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/makeConnectionTrusted`,
  })
  public async makeConnectionTrusted(data: { connectionId: string }) {
    const result = await this.connectionsService.makeConnectionTrusted(
      data.connectionId,
    );
    return result;
  }

  @Version(['1'])
  @ApiBody({ type: AcceptConnectionInvitationBody })
  @Post('accept-connection-invitation')
  @ApiOperation({
    summary: 'Accept connection invitation',
    description:
      'This call provides the capability to receive connection invitation as invitee by invitationUrl and create connection. If auto accepting is enabled via either the config passed in the function or the global agent config, a connection request message will be send.',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Accepted Connection Request',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Accepted Connection Request': {
            value: {
              statusCode: 202,
              message: 'Accepted Connection Request',
              data: {
                _tags: {
                  invitationKey: '5Nj',
                  state: 'invited',
                  role: 'invitee',
                  verkey: 'F6d',
                },
                metadata: {},
                id: 'e6d30380',
                createdAt: '1970-01-01T00:00:00.103Z',
                did: 'Ss8',
                didDoc: {
                  '@context': 'https://w3id.org/did/v1',
                  publicKey: [
                    {
                      id: 'Ss8#1',
                      controller: 'Ss8',
                      type: 'Ed25519VerificationKey2018',
                      publicKeyBase58: 'F6d',
                    },
                  ],
                  service: [
                    {
                      id: 'Ss8',
                      serviceEndpoint:
                        'https://serviceEndpointUrl.com:443/ocm/didcomm',
                      type: 'IndyAgent',
                      priority: 0,
                      recipientKeys: ['F6d'],
                      routingKeys: [],
                    },
                  ],
                  authentication: [
                    {
                      publicKey: 'Ss8#1',
                      type: 'Ed25519SignatureAuthentication2018',
                    },
                  ],
                  id: 'Ss8',
                },
                verkey: 'F6d',
                theirLabel: 'ssi-abstraction-agent',
                state: 'requested',
                role: 'invitee',
                alias: 'connection-received',
                autoAcceptConnection: true,
                invitation: {
                  '@type': 'https://didcomm.org/connections/1.0/invitation',
                  '@id': '12ebbf61',
                  label: 'ssi-abstraction-agent',
                  recipientKeys: ['5Nj'],
                  serviceEndpoint:
                    'https://serviceEndpointUrl.com:443/ocm/didcomm',
                  routingKeys: [],
                },
                multiUseInvitation: false,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error or Bad Request',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error or Bad Request': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.668Z',
              message: 'something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  public async acceptConnectionInvitation(
    @Body() body: AcceptConnectionInvitationBody,
    @Res() response: Response,
  ) {
    const { invitationUrl, autoAcceptConnection } = body;

    const { agentUrl } = this.connectionsService.getAgentUrl();

    const responseData: ResponseType = {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Accepted Connection Request',
      data: await this.connectionsService.acceptConnectionInvitation(agentUrl, {
        invitationUrl,
        autoAcceptConnection,
        alias: RECEIVED_CONNECTION_ALIAS,
      }),
    };

    return response.status(responseData.statusCode).send(responseData);
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/getReceivedConnections`,
  })
  public async getReceivedConnections() {
    let result: object[] = [];
    const connections = await this.connectionsService.getReceivedConnections();
    if (connections[0]) {
      [, result] = connections;
    }
    return result;
  }
}
