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
import { ConfigService } from '@nestjs/config';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Base64 } from 'js-base64';
import {
  ATTESTATION,
  Abstraction,
  NATSServices,
  States,
} from '../../common/constants.js';
import ResponseType from '../../common/response.js';
import logger from '../../utils/logger.js';
import AcceptPresentationDto from '../entities/accept-presentation.dto.js';
import AcceptProofRequestDto from '../entities/accept-proof-request.dto.js';
import FindProofPresentationDto from '../entities/find-proof-presentation.dto.js';
import GetPresentProofsDto from '../entities/get-present-proofs.dto.js';
import GetProofRequest from '../entities/get-proof-request.dto.js';
import MembershipCredentialDto from '../entities/membership-credential.dto.js';
import PresentationSubscriptionEndpointDto from '../entities/presentationSubscribeEndPoint.entity.js';
import SendProofRequestBody from '../entities/send-proof-request-body.dto.js';
import SendProofRequest from '../entities/send-proof-request.dto.js';
import PresentationProofsService from '../services/service.js';

@ApiTags('Proofs')
@Controller()
export default class PresentationProofsController {
  constructor(
    private readonly presentationProofsService: PresentationProofsService,
    private configService: ConfigService,
  ) {}

  @Version(['1'])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'proofRecordId', required: false })
  @ApiQuery({ name: 'connectionId', required: false })
  @ApiQuery({ name: 'credentialDefId', required: false })
  @ApiQuery({ name: 'schemaId', required: false })
  @ApiQuery({ name: 'theirDid', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'createdDateStart', required: false })
  @ApiQuery({ name: 'createdDateEnd', required: false })
  @ApiQuery({ name: 'updatedDateStart', required: false })
  @ApiQuery({ name: 'updatedDateEnd', required: false })
  @Get('find-proof-presentation')
  @ApiOperation({
    summary: 'Fetch list of proof requests',
    description:
      'This call provides the capability to search proofs (Credential Presentation) by using pagination and filter parameters. This call returns a list of proof requests (Proof Presentations) and overall count of records. Filter supports following parameters: page, pageSize, proofRecordId, connectionId, credentialDefId, schemaId, theirDid, status, createdDateStart, createdDateEnd, updatedDateStart, updatedDateEnd',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proof presentations fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Proof presentations fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Proof presentations fetched successfully',
              data: {
                count: 1,
                records: [
                  {
                    id: '30774a7e',
                    proofRecordId: '9b4ab922',
                    connectionId: '',
                    credentialDefId: '',
                    schemaId: '',
                    theirDid: '',
                    status: 'request-sent',
                    createdDate: '1970-01-01T00:00:00.642Z',
                    updatedDate: '1970-01-01T00:00:00.642Z',
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
  async findProofPresentation(
    @Query() query: FindProofPresentationDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    const result = await this.presentationProofsService.findProofPresentation(
      query.pageSize ? parseInt(query.pageSize, 10) : 10,
      query.page ? parseInt(query.page, 10) : 0,
      query.proofRecordId ? query.proofRecordId : false,
      query.connectionId ? query.connectionId : false,
      query.credentialDefId ? query.credentialDefId : false,
      query.schemaId ? query.schemaId : false,
      query.theirDid ? query.theirDid : false,
      query.status ? query.status : false,
      query.createdDateStart ? query.createdDateStart : false,
      query.createdDateEnd ? query.createdDateEnd : false,
      query.updatedDateStart ? query.updatedDateStart : false,
      query.updatedDateEnd ? query.updatedDateEnd : false,
    );
    if (Array.isArray(result) && result[0] > 0) {
      response.status(HttpStatus.OK);
      res = {
        statusCode: HttpStatus.OK,
        message: 'Proof presentations fetched successfully',
        data: {
          count: result[0],
          records: result[1],
        },
      };
      logger.info('Proof presentations fetched successfully');
      return response.send(res);
    }
    response.status(HttpStatus.NOT_FOUND);
    res = {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No Data found',
    };
    return response.send(res);
  }

  @ApiQuery({ name: 'proofRecordId', required: true })
  @Version(['1'])
  @Get('find-by-presentation-id')
  @ApiOperation({
    summary: 'Fetch proof presentation by proofRequestId',
    description:
      'This call provides the capability to get proof request by providing proofRecordId (presentationId). The call returns an information about proof request and also (if user accepted proof request) information about requested user credentials',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proof presentation fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Proof presentation fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Proof presentation fetched successfully',
              data: {
                state: 'request-sent',
                presentations: [
                  {
                    schemaId: '',
                    credDefId: '',
                    revRegId: '',
                    timestamp: '',
                    credentialSubject: {},
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Find presentation request required following attributes: ( proofRecordId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Find presentation request required following attributes: ( proofRecordId )':
            {
              value: {
                statusCode: 400,
                message:
                  'Find presentation request required following attributes: ( proofRecordId )',
              },
            },
        },
      },
    },
  })
  async findProofByProofRecordId(
    @Query() query: AcceptPresentationDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;

    if (!query.proofRecordId) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Find presentation request required following attributes: ( proofRecordId )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    const result =
      await this.presentationProofsService.findProofByProofRecordId(
        query.proofRecordId,
      );
    let schemaId: string;
    let credDefId: string;
    let revRegId: string;
    let timestamp: string;
    let resData: {
      presentations: {
        schemaId: string;
        credDefId: string;
        revRegId: string;
        timestamp: string;
        credentialSubject: Record<string, string>;
      }[];
      state: string;
    };
    if (result) {
      if (result.state === 'done') {
        const data = JSON.parse(
          Base64.decode(
            result.presentationMessage['presentations~attach'][0].data.base64,
          ),
        );

        resData = {
          state: result.state,
          presentations: [],
        };

        const revealedAttrGroupsKeys = Object.keys(
          data.requested_proof.revealed_attr_groups,
        );

        for (let i = 0; i < revealedAttrGroupsKeys.length; i += 1) {
          const revealedAttrGroupsKey = revealedAttrGroupsKeys[i];
          const subIndex =
            data.requested_proof.revealed_attr_groups[revealedAttrGroupsKey]
              .sub_proof_index;

          const presentationData: (typeof resData)['presentations'][number] = {
            schemaId: data.identifiers[subIndex].schema_id,
            credDefId: data.identifiers[subIndex].cred_def_id,
            revRegId: data.identifiers[subIndex].rev_reg_id,
            timestamp: data.identifiers[subIndex].timestamp,
            credentialSubject: {},
          };

          const keys = Object.keys(
            data.requested_proof.revealed_attr_groups[revealedAttrGroupsKey]
              .values,
          );

          keys.forEach((key) => {
            // eslint-disable-next-line max-len
            presentationData.credentialSubject[key] =
              data.requested_proof.revealed_attr_groups[
                revealedAttrGroupsKey
              ].values[key].raw;
          });

          resData.presentations.push(presentationData);
        }
      } else {
        schemaId = '';
        credDefId = '';
        revRegId = '';
        timestamp = '';

        resData = {
          state: result.state,
          presentations: [
            {
              schemaId,
              credDefId,
              revRegId,
              timestamp,
              credentialSubject: {},
            },
          ],
        };
      }

      response.status(HttpStatus.OK);
      res = {
        statusCode: HttpStatus.OK,
        message: 'Proof presentation fetched successfully',
        data: resData,
      };
      return response.send(res);
    }
    response.status(HttpStatus.NOT_FOUND);
    res = {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No Data found',
    };
    return response.send(res);
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/sendMembershipProofRequest`,
  })
  async sendPrincipalCredentialPresentationRequest(data: {
    connectionId: string;
  }) {
    let res: ResponseType;
    if (data.connectionId) {
      // eslint-disable-next-line max-len
      const principalCredentialDetail =
        await this.presentationProofsService.getCredentialsTypeDetails(
          ATTESTATION.CREDENTIAL_TYPE,
        );
      const attributes: {
        attributeName: string;
        schemaId: string;
        value: string;
        condition: string;
      }[] = [];
      principalCredentialDetail.schema.attribute.forEach(
        (member: { name: string }) => {
          attributes.push({
            attributeName: member.name,
            schemaId: principalCredentialDetail.schema.schemaID,
            value: '',
            condition: '',
          });
        },
      );

      const sendProofRes: MembershipCredentialDto = {
        connectionId: data.connectionId,
        attributes,
      };

      // eslint-disable-next-line max-len
      const resp =
        await this.presentationProofsService.sendPrincipalCredentialPresentationRequest(
          sendProofRes,
        );
      const sendProofPayload: SendProofRequest = {
        proofRecordId: resp.id,
        theirDID: resp.theirDid,
        status: resp.state,
        attributes,
        connectionId: data.connectionId,
      };

      res = {
        statusCode: HttpStatus.CREATED,
        message: 'Presentation request send successfully',
        data: await this.presentationProofsService.createPresentationRequest(
          sendProofPayload,
        ),
      };
      logger.info('Presentation request send successfully');
    } else {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Required following attributes ( connectionId )',
      };
    }
    return res;
  }

  @EventPattern({
    endpoint: `${Abstraction.NATS_ENDPOINT}/${Abstraction.PROOF_STATE_CHANGED}`,
  })
  async webhookGetProofPresentation(body: { proofRecord: GetProofRequest }) {
    const getProofRequest = body.proofRecord;
    let res: ResponseType;
    let getProofRequestDTO: GetProofRequest;
    const presentationSubscriptionEndpointDto: PresentationSubscriptionEndpointDto =
      {
        proofRecordId: getProofRequest.id,
        status: getProofRequest.state,
      };

    /**
     * Sent Connection updates to subscriber
     */
    this.presentationProofsService.publishPresentationSubscriberEndpoint(
      presentationSubscriptionEndpointDto,
    );

    if (
      getProofRequest.state === States.PresentationReceived ||
      getProofRequest.state === States.Done
    ) {
      getProofRequestDTO = {
        id: getProofRequest.id ? getProofRequest.id : '',
        state: getProofRequest.state ? getProofRequest.state : '',
        connectionId: getProofRequest.connectionId
          ? getProofRequest.connectionId
          : '',
      };
      const getResponse =
        await this.presentationProofsService.updatePresentationStatus(
          getProofRequestDTO,
        );
      if (
        this.configService.get('ACCEPT_PRESENTATION_CONFIG') === 'AUTO' &&
        getProofRequest.state === States.PresentationReceived
      ) {
        res = {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Presentation received request accepted successfully',
          data: await this.presentationProofsService.acceptPresentation(
            getResponse.proofRecordId,
          ),
        };
        return res;
      }
      if (getProofRequest.state === States.Done) {
        await this.presentationProofsService.makeConnectionTrusted(
          getProofRequest.connectionId,
        );
      }
    }
    res = {
      statusCode: HttpStatus.OK,
      message: 'Presentation states noted.',
    };
    return res;
  }

  @Version(['1'])
  @ApiBody({ type: SendProofRequest })
  @Post('send-presentation-request')
  @ApiOperation({
    summary: 'Send presentation request',
    description:
      'This call provides the capability to create a new presentation request bound to existing connection. It is mandatory to provide a schema for every requested attribute and attribute name in the body information of the connection. The call returns an information about proof request (proofRecordId, connectionId, credentialDefId, schemaId, theirDid, status, createdDate, updatedDate, threadId)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Presentation request sent successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation request sent successfully': {
            value: {
              statusCode: 201,
              message: 'Presentation request sent successfully',
              data: {
                id: 'a7ccc2f7',
                proofRecordId: 'fb556018-1907-47c1-a6d6-c7cbca7d23b4',
                connectionId: 'a9371aed-67ed-4448-ace0-d773e7b30e1c',
                credentialDefId: '',
                schemaId: '',
                theirDid: '',
                status: 'request-sent',
                createdDate: '2023-03-02T13:02:43.656Z',
                updatedDate: '2023-03-02T13:02:43.656Z',
                threadId: '75045c1b-f0ef-4f10-831e-4e4f301333af',
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
      'Find presentation request required following attributes: ( proofRecordId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Find presentation request required following attributes: ( proofRecordId )':
            {
              value: {
                statusCode: 400,
                message:
                  'Find presentation request required following attributes: ( proofRecordId )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Could not get schema or connection details. please try again.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Could not get schema or connection details. please try again.': {
            value: {
              statusCode: 400,
              message:
                'Could not get schema or connection details. please try again.',
            },
          },
        },
      },
    },
  })
  async sendPresentationRequest(
    @Body() sendProofRequest: SendProofRequest,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    if (
      !(
        sendProofRequest.connectionId &&
        Array.isArray(sendProofRequest.attributes) &&
        sendProofRequest.attributes.every(
          (i) =>
            (typeof i.schemaId === 'string' && i.schemaId.trim().length > 0) ||
            (typeof i.credentialDefId === 'string' &&
              i.credentialDefId.trim().length > 0),
        )
      )
    ) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Send presentation request required following attributes ( connectionId, attributes,schemaId or credentialDefId)', // eslint-disable-line
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    const resp =
      await this.presentationProofsService.sendPresentationRequest(
        sendProofRequest,
      );
    logger.info(`sendPresentationRequest response ${JSON.stringify(resp)}`);
    if (resp?.id) {
      const sendProofRes: SendProofRequest = sendProofRequest;
      sendProofRes.proofRecordId = resp.id;
      sendProofRes.theirDID = resp.theirDid;
      sendProofRes.status = resp.state;
      response.status(HttpStatus.CREATED);

      // eslint-disable-next-line max-len
      const createPresentationRequestRes =
        await this.presentationProofsService.createPresentationRequest(
          // eslint-disable-line
          sendProofRes,
        );
      res = {
        statusCode: HttpStatus.CREATED,
        message: 'Presentation request sent successfully',
        data: {
          ...createPresentationRequestRes,
          threadId: resp.threadId,
        },
      };
      logger.info('Presentation request send successfully');
    } else {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Could not get schema or connection details. please try again.',
      };
    }
    return response.send(res);
  }

  @Version(['1'])
  @ApiBody({ type: SendProofRequestBody })
  @Post('send-out-of-band-presentation-request')
  @ApiOperation({
    summary: 'Send out of band presentation request',
    description:
      'This call provides the capability to create a new presentation request not bound to any proposal or existing connection. The call returns an information about presentation request',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Presentation request sent successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation request sent successfully': {
            value: {
              statusCode: 201,
              message: 'Presentation request sent successfully',
              data: {
                id: 'd6667caa',
                proofRecordId: '600dd422',
                connectionId: '',
                credentialDefId: '',
                schemaId: '',
                theirDid: '',
                status: 'request-sent',
                createdDate: '1970-01-01T00:00:00.934Z',
                updatedDate: '1970-01-01T00:00:00.934Z',
                presentationMessage:
                  'https://serviceEndpointUrl.com:443/ocm/didcomm/?d_m=eyJAdHlwZSI6I',
                presentationMessageShort: 'https://selfUrl.com/v1/url/1234abcd',
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
      'Send presentation request required following attributes( attributes, schemaId or credentialDefinitionId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Send presentation request required following attributes( attributes, schemaId or credentialDefinitionId )':
            {
              value: {
                statusCode: 400,
                message:
                  'Send presentation request required following attributes( attributes, schemaId or credentialDefinitionId )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Could not get schema details. please try again.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Could not get schema details. please try again.': {
            value: {
              statusCode: 400,
              message: 'Could not get schema details. please try again.',
            },
          },
        },
      },
    },
  })
  async sendOutOfBandPresentationRequest(
    @Body() sendProofRequestBody: SendProofRequestBody,
    @Res() response: Response,
  ) {
    const sendProofRequest: SendProofRequest = {
      attributes: [],
    };
    // sendProofRequest.credentialDefId = sendProofRequestBody.options?.credentialDefinitionId;

    let res: ResponseType;
    if (
      !(
        Array.isArray(sendProofRequestBody.attributes) &&
        sendProofRequestBody.attributes.every(
          (i) =>
            (typeof i.schemaId === 'string' && i.schemaId.trim().length > 0) ||
            (typeof i.credentialDefId === 'string' &&
              i.credentialDefId.trim().length > 0),
        )
      )
    ) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Send presentation request required following attributes( attributes, schemaId or credentialDefinitionId )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    // REVIEW:
    // const valideSchemaIdOrCredentialId = await Promise.allSettled([
    //   this.presentationProofsService.getSchemaById(
    //     `${sendProofRequest.schemaId}`,
    //   ),
    //   this.presentationProofsService.getCredentialDefinitionsById(
    //     `${sendProofRequest.credentialDefId}`,
    //   ),
    // ]);
    // logger.info(
    //   `valideSchemaIdOrCredentialId[0].status ${valideSchemaIdOrCredentialId[0].status}`,
    // );
    // logger.info(
    //   `valideSchemaIdOrCredentialId[1].status ${valideSchemaIdOrCredentialId[1].status}`,
    // );
    // if (
    //   valideSchemaIdOrCredentialId[0].status !== 'fulfilled'
    //   && valideSchemaIdOrCredentialId[1].status !== 'fulfilled'
    // ) {
    //   res = {
    //     statusCode: HttpStatus.BAD_REQUEST,
    //     message: 'Please provide a valid schema ID or credential def ID',
    //   };
    //   return response.status(HttpStatus.BAD_REQUEST).send(res);
    // }

    sendProofRequestBody.attributes.forEach((element) => {
      sendProofRequest.attributes.push({
        attributeName: element.attributeName,
        value: element.value,
        condition: element.condition,
        schemaId: element.schemaId,
        credentialDefId: element.credentialDefId,
      });
    });

    const resp =
      await this.presentationProofsService.sendOutOfBandPresentationRequest(
        sendProofRequest,
      );
    logger.info(`agent response ${JSON.stringify(resp)}`);
    if (resp?.proofRecord?.id) {
      const sendProofRes: SendProofRequest = sendProofRequest;
      sendProofRes.proofRecordId = resp.proofRecord.id;
      sendProofRes.theirDID = resp.theirDid;
      sendProofRes.status = resp.proofRecord.state;
      response.status(HttpStatus.CREATED);
      const getResult =
        await this.presentationProofsService.createPresentationRequest(
          sendProofRes,
        );
      const resResult = {
        ...getResult,
        presentationMessage: resp.message,
        presentationMessageShort: resp.messageShort,
      };
      res = {
        statusCode: HttpStatus.CREATED,
        message: 'Presentation request sent successfully',
        data: resResult,
      };
      logger.info('Presentation request sent successfully');
    } else {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Could not get schema details. please try again.',
      };
    }
    return response.send(res);
  }

  @Version(['1'])
  @ApiQuery({ name: 'type', required: true })
  @Post('out-of-band-proof')
  @ApiOperation({
    summary: 'Send out of band proof',
    description:
      'This call provides the capability to create a new presentation request not bound to any proposal or existing connection but it creates just on type defined in attestation manager (type is bound to schema id there). The call returns an information about presentation request',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Presentation request sent successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation request sent successfully': {
            value: {
              statusCode: 201,
              message: 'Presentation request sent successfully',
              data: {
                id: '60f38aa4',
                proofRecordId: '852ee278',
                connectionId: '',
                credentialDefId: '',
                schemaId: '',
                theirDid: '',
                status: 'request-sent',
                createdDate: '2023-03-02T13:12:38.934Z',
                updatedDate: '2023-03-02T13:12:38.934Z',
                presentationMessage:
                  'https://serviceEndpointUrl.com:443/ocm/didcomm/?d_m=eyJAdHlwZSI6Imh0dHBzOi8',
                presentationMessageShort: 'https://selfUrl/v1/url/1234abcd',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Could not get schema details. please try again.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Could not get schema details. please try again.': {
            value: {
              statusCode: 400,
              message: 'Could not get schema details. please try again.',
            },
          },
        },
      },
    },
  })
  async outOfBandProof(
    @Query() query: { type: string },
    @Res() response: Response,
  ) {
    let res: ResponseType;
    // eslint-disable-next-line max-len
    const typesArr = query.type.split(',');

    const principalCredentialDetailPromiseArr = [];

    for (let i = 0; i < typesArr.length; i += 1) {
      principalCredentialDetailPromiseArr.push(
        this.presentationProofsService.getCredentialsTypeDetails(typesArr[i]),
      );
    }

    const principalCredentialDetail = await Promise.all(
      principalCredentialDetailPromiseArr,
    );
    const attributes: {
      attributeName: string;
      schemaId: string;
      value: '';
      condition: '';
    }[] = [];
    for (let i = 0; i < principalCredentialDetail.length; i += 1) {
      principalCredentialDetail[i].schema.attribute.forEach(
        (member: { name: string }) => {
          attributes.push({
            attributeName: member.name,
            schemaId: principalCredentialDetail[i].schema.schemaID,
            value: '',
            condition: '',
          });
        },
      );
    }

    const sendProofRequest: SendProofRequest = {
      attributes,
      connectionId: '',
      proofRecordId: '',
    };
    const resp =
      await this.presentationProofsService.sendOutOfBandPresentationRequest(
        sendProofRequest,
      );
    if (resp?.proofRecord?.id) {
      const sendProofRes: SendProofRequest = sendProofRequest;
      sendProofRes.proofRecordId = resp.proofRecord.id;
      sendProofRes.theirDID = resp.theirDid;
      sendProofRes.status = resp.proofRecord.state;
      response.status(HttpStatus.CREATED);
      const getResult =
        await this.presentationProofsService.createPresentationRequest(
          sendProofRes,
        );
      const resResult = {
        ...getResult,
        presentationMessage: resp.message,
        presentationMessageShort: resp.messageShort,
      };
      res = {
        statusCode: HttpStatus.CREATED,
        message: 'Presentation request sent successfully',
        data: resResult,
      };
      logger.info('Presentation request sent successfully');
    } else {
      response.status(HttpStatus.BAD_REQUEST);
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Could not get schema details. please try again.',
      };
    }
    return response.send(res);
  }

  @Version(['1'])
  @Post('accept-presentation/:proofRecordId')
  @ApiOperation({
    summary: 'Accept presentation request by proofRecordId',
    description:
      'Accept a presentation as prover (by sending a presentation acknowledgement message) to the connection associated with the proof record.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presentation accepted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation accepted successfully': {
            value: {}, // TODO: example
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Accept presentation request required following attributes ( proof_record_id )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Accept presentation request required following attributes ( proof_record_id )':
            {
              value: {
                statusCode: 400,
                message:
                  'Accept presentation request required following attributes ( proof_record_id )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.891Z',
              message: 'Something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async acceptPresentation(
    @Param() params: AcceptPresentationDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    if (!params.proofRecordId) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Accept presentation request required following attributes ( proof_record_id )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    logger.info('Presentation accepted successfully');
    res = {
      statusCode: HttpStatus.OK,
      message: 'Presentation accepted successfully',
      data: await this.presentationProofsService.acceptPresentation(
        params.proofRecordId,
      ),
    };
    return response.status(HttpStatus.OK).send(res);
  }

  @Version(['1'])
  @Post('accept-proof-request/:proofRecordId')
  @ApiOperation({
    summary: 'Accept proof request by proofRecordId',
    description:
      'Accept a presentation request as prover (by sending a presentation message) to the connection associated with the proof record.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request accepted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Request accepted successfully': {
            value: {
              statusCode: 200,
              message: 'Request accepted successfully',
              data: {
                _tags: {
                  threadId: '6b5c57b3',
                  state: 'request-received',
                  connectionId: '653b8cdc',
                },
                metadata: {},
                id: '19c5269f',
                createdAt: '1970-01-01T00:00:00.498Z',
                requestMessage: {
                  '@type':
                    'https://didcomm.org/present-proof/1.0/request-presentation',
                  '@id': '6b5c57b3',
                  comment: 'Proof Presenation',
                  'request_presentations~attach': [
                    {
                      '@id': 'libindy-request-presentation-0',
                      'mime-type': 'application/json',
                      data: {
                        base64: 'eyJuYW=',
                      },
                    },
                  ],
                },
                state: 'presentation-sent',
                connectionId: '653b8cdc',
                threadId: '6b5c57b3',
                presentationMessage: {
                  '@type': 'https://didcomm.org/present-proof/1.0/presentation',
                  '@id': 'c1089096',
                  'presentations~attach': [
                    {
                      '@id': 'libindy-presentation-0',
                      'mime-type': 'application/json',
                      data: {
                        base64: 'eyJwcm9vZ',
                      },
                    },
                  ],
                  '~thread': {
                    thid: '6b5c57b3',
                  },
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
    description:
      'Accept proof request required following attributes ( proofRecordId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Accept proof request required following attributes ( proofRecordId )':
            {
              value: {
                statusCode: 400,
                timestamp: '1970-01-01T00:00:00.891Z',
                message:
                  'Accept proof request required following attributes ( proofRecordId )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.891Z',
              message: 'Something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async acceptProofRequest(
    @Param() params: AcceptProofRequestDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    if (!params.proofRecordId) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Accept proof request required following attributes ( proofRecordId )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    logger.info('Request accepted successfully');
    res = {
      statusCode: HttpStatus.OK,
      message: 'Request accepted successfully',
      data: await this.presentationProofsService.acceptProofRequest(
        params.proofRecordId,
      ),
    };
    return response.status(HttpStatus.OK).send(res);
  }

  @Version(['1'])
  @Post('delete-proof-request/:proofRecordId')
  @ApiOperation({
    summary: 'Delete proof request by proofRecordId',
    description: 'Deletes a proofRecord in the proof repository.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete proof request',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Delete proof request': {
            value: {
              statusCode: 200,
              message: 'Proof request deleted successfully',
              data: '',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Delete proof request required following attributes ( proofRecordId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Delete proof request required following attributes ( proofRecordId )':
            {
              value: {
                statusCode: 400,
                timestamp: '1970-01-01T00:00:00.891Z',
                message:
                  'Delete proof request required following attributes ( proofRecordId )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.891Z',
              message: 'Something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async deleteProofRequest(
    @Param() params: AcceptProofRequestDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    if (!params.proofRecordId) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Delete proof request required following attributes ( proofRecordId )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    logger.info('Proof request deleting');
    res = {
      statusCode: HttpStatus.OK,
      message: 'Proof request deleted successfully',
      data: await this.presentationProofsService.deleteProofRequest(
        params.proofRecordId,
      ),
    };
    return response.status(HttpStatus.OK).send(res);
  }

  @Version(['1'])
  @Post('decline-proof-request/:proofRecordId')
  @ApiOperation({
    summary: 'Decline proof request by proofRecordId',
    description:
      'Decline proof request as prover (by sending a presentation message) to the connection associated with the proof record.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request declined successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Request declined successfully': {
            value: {
              statusCode: 200,
              message: 'Request declined successfully',
              data: {
                _tags: {
                  threadId: '6b5c57b3',
                  state: 'request-received',
                  connectionId: '653b8cdc',
                },
                metadata: {},
                id: '19c5269f',
                createdAt: '1970-01-01T00:00:00.498Z',
                requestMessage: {
                  '@type':
                    'https://didcomm.org/present-proof/1.0/request-presentation',
                  '@id': '6b5c57b3',
                  comment: 'Proof Presenation',
                  'request_presentations~attach': [
                    {
                      '@id': 'libindy-request-presentation-0',
                      'mime-type': 'application/json',
                      data: {
                        base64: 'eyJuYW=',
                      },
                    },
                  ],
                },
                state: 'presentation-sent',
                connectionId: '653b8cdc',
                threadId: '6b5c57b3',
                presentationMessage: {
                  '@type': 'https://didcomm.org/present-proof/1.0/presentation',
                  '@id': 'c1089096',
                  'presentations~attach': [
                    {
                      '@id': 'libindy-presentation-0',
                      'mime-type': 'application/json',
                      data: {
                        base64: 'eyJwcm9vZ',
                      },
                    },
                  ],
                  '~thread': {
                    thid: '6b5c57b3',
                  },
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
    description:
      'Accept proof request required following attributes ( proofRecordId )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Accept proof request required following attributes ( proofRecordId )':
            {
              value: {
                statusCode: 400,
                timestamp: '1970-01-01T00:00:00.891Z',
                message:
                  'Accept proof request required following attributes ( proofRecordId )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.891Z',
              message: 'Something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async declineProofRequest(
    @Param() params: AcceptProofRequestDto,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    if (!params.proofRecordId) {
      res = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Decline proof request required following attributes ( proofRecordId )',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(res);
    }
    logger.info('Request decline in progress...');
    res = await this.presentationProofsService.declineProofRequest(
      params.proofRecordId,
    );
    return response.status(HttpStatus.OK).send(res);
  }

  @Version(['1'])
  @ApiQuery({ name: 'threadId', required: false })
  @Get('agent-proofs')
  @ApiOperation({
    summary: 'Fetch all proofs directly from the agent',
    description:
      'This call provides the capability to get all proof records directly from agent. Pagination and sorting does not implemented in that version of Aries Framework Javascript',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proofs fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Proofs fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Proofs fetched successfully',
              data: [
                {
                  _tags: {
                    threadId: '75045c1b',
                    state: 'request-received',
                    connectionId: 'e6d30380',
                  },
                  metadata: {},
                  id: '6f776996',
                  createdAt: '1970-01-01T00:00:00.640Z',
                  requestMessage: {
                    '@type':
                      'https://didcomm.org/present-proof/1.0/request-presentation',
                    '@id': '75045c1b',
                    comment: 'Proof Presenation',
                    'request_presentations~attach': [
                      {
                        '@id': 'libindy-request-presentation-0',
                        'mime-type': 'application/json',
                        data: {
                          base64: 'eyJ',
                        },
                      },
                    ],
                  },
                  state: 'request-received',
                  connectionId: 'e6d30380',
                  threadId: '75045c1b',
                },
                {
                  _tags: {
                    connectionId: 'a9371aed',
                    state: 'request-sent',
                    threadId: '75045c1b',
                  },
                  metadata: {},
                  id: 'fb556018',
                  createdAt: '1970-01-01T00:00:00.568Z',
                  requestMessage: {
                    '@type':
                      'https://didcomm.org/present-proof/1.0/request-presentation',
                    '@id': '75045c1b',
                    comment: 'Proof Presenation',
                    'request_presentations~attach': [
                      {
                        '@id': 'libindy-request-presentation-0',
                        'mime-type': 'application/json',
                        data: {
                          base64: 'eyJ',
                        },
                      },
                    ],
                  },
                  state: 'request-sent',
                  connectionId: 'a9371aed',
                  threadId: '75045c1b',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:00.891Z',
              message: 'Something went wrong: Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getAllProofRequest(
    @Query() query: { threadId: string },
    @Res() response: Response,
  ) {
    const res: ResponseType = {
      statusCode: HttpStatus.OK,
      message: 'Proofs fetched successfully',
      data: await this.presentationProofsService.getAllProofRequest(
        query.threadId,
      ),
    };
    return response.status(HttpStatus.OK).send(res);
  }

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/getPresentProofs`,
  })
  async getPresentProofs(data: GetPresentProofsDto) {
    return this.presentationProofsService.getPresentProofs(data);
  }

  @Version(['1'])
  @Get('url/:id')
  @ApiOperation({
    summary: 'Get full url from short url id',
    description: 'Get full url from short url id',
  })
  async redirectToOriginalUrl(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const result = await this.presentationProofsService.findUrlByShortUrlId(id);
    if (!result) {
      throw new Error('Not found');
    }
    response.writeHead(302, {
      location: result.originalUrl,
    });
    return response.end();
  }
}
