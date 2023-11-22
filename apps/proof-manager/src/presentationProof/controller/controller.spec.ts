/* eslint-disable @typescript-eslint/no-explicit-any */
import type FindProofPresentationDto from '../entities/find-proof-presentation.dto.js';
import type SendProofRequest from '../entities/send-proof-request.dto.js';
import type { TestingModule } from '@nestjs/testing';

import { HttpModule } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import { NATSServices } from '../../common/constants.js';
import PrismaService from '../../prisma/prisma.service.js';
import PresentationProofsService from '../services/service.js';

import PresentationProofsController from './controller.js';

describe.skip('Proof Presentation Controller', () => {
  let controller: PresentationProofsController;
  let service: PresentationProofsService;
  let natsClient: NatsClientService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
        ClientsModule.register([
          {
            name: NATSServices.SERVICE_NAME,
            transport: Transport.NATS,
          },
        ]),
      ],
      controllers: [PresentationProofsController],
      providers: [
        PresentationProofsService,
        PrismaService,
        NatsClientService,
        RestClientService,
      ],
      exports: [PrismaService],
    }).compile();

    service = module.get<PresentationProofsService>(PresentationProofsService);
    controller = module.get<PresentationProofsController>(
      PresentationProofsController,
    );
    natsClient = module.get<NatsClientService>(NatsClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all proof presentation', () => {
    it('should return an array of proof presentation', async () => {
      const query: FindProofPresentationDto = {
        pageSize: '0',
        page: '0',
      };

      const serviceResult: any = [
        1,
        {
          id: '3b5e9083-2c2d-4acf-8b18-13f43e31c7df',
          proof_record_id: '0448de40-415c-4448-bfa0-456fd8936f91',
          participant_id: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          connectionId: '9c80d8c0-8893-4638-97d2-221024f5bafa',
          credential_def_id: 'LC5aqqDP6sB7Nyn3GHn4eC:3:CL:242017:UID',
          schemaId: '',
          their_did: '',
          status: 'done',
          created_date: '2022-04-19T12:45:38.872Z',
          updated_date: '2022-04-19T12:45:55.541Z',
        },
      ];

      const result: any = {
        count: 1,
        records: {
          id: '3b5e9083-2c2d-4acf-8b18-13f43e31c7df',
          proof_record_id: '0448de40-415c-4448-bfa0-456fd8936f91',
          participant_id: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          connectionId: '9c80d8c0-8893-4638-97d2-221024f5bafa',
          credential_def_id: 'LC5aqqDP6sB7Nyn3GHn4eC:3:CL:242017:UID',
          schemaId: '',
          their_did: '',
          status: 'done',
          created_date: '2022-04-19T12:45:38.872Z',
          updated_date: '2022-04-19T12:45:55.541Z',
        },
      };

      const response = createResponse();

      jest
        .spyOn(service, 'findProofPresentation')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await controller.findProofPresentation(query, response);
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(resData.data).toStrictEqual(result);
    });

    it('should return an no data found', async () => {
      const query: FindProofPresentationDto = {
        pageSize: '0',
        page: '0',
      };
      const serviceResult: any = [0, []];

      const result: any = { statusCode: 404, message: 'No Data found' };
      const response = createResponse();
      jest
        .spyOn(service, 'findProofPresentation')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await controller.findProofPresentation(query, response);
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(resData.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(resData).toStrictEqual(result);
    });
  });

  describe('find-by-presentation-id', () => {
    it('should return an proof presentation', async () => {
      const query = {
        proof_record_id: '6703e2e3-4bb3-463d-b2e4-5ea41ccd031f',
        participant_id: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
      };
      const serviceResult: any = {
        _tags: {
          state: 'done',
          connectionId: 'f2e80e21-f3ab-4b27-abbc-319141457a5b',
          threadId: '1a1a6abf-e730-4d60-b33d-702527f81563',
        },
        metadata: {},
        id: '6703e2e3-4bb3-463d-b2e4-5ea41ccd031f',
        createdAt: '2022-04-19T11:13:10.825Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': '1a1a6abf-e730-4d60-b33d-702527f81563',
          comment: 'Tested participant',
          'request_presentations~attach': [
            {
              '@id': 'libindy-request-presentation-0',
              'mime-type': 'application/json',
              data: {
                base64:
                  'eyJuYW1lIjoiUHJvb2YgUmVxdWVzdCIsInZlcnNpb24iOiJQcm9vZiBSZXF1ZXN0Iiwibm9uY2UiOiI1MjY2MTI4Mjg3NjAiLCJyZXF1ZXN0ZWRfYXR0cmlidXRlcyI6eyJhZGRpdGlvbmFsUHJvcDEiOnsibmFtZXMiOlsiZk5hbWUiXSwicmVzdHJpY3Rpb25zIjpbeyJjcmVkX2RlZl9pZCI6IkxDNWFxcURQNnNCN055bjNHSG40ZUM6MzpDTDoyNDIwMTc6VUlEIn1dfX0sInJlcXVlc3RlZF9wcmVkaWNhdGVzIjp7fX0=',
              },
            },
          ],
        },
        state: 'done',
        connectionId: 'f2e80e21-f3ab-4b27-abbc-319141457a5b',
        threadId: '1a1a6abf-e730-4d60-b33d-702527f81563',
        isVerified: true,
      };

      const result: any = {
        _tags: {
          state: 'done',
          connectionId: 'f2e80e21-f3ab-4b27-abbc-319141457a5b',
          threadId: '1a1a6abf-e730-4d60-b33d-702527f81563',
        },
        metadata: {},
        id: '6703e2e3-4bb3-463d-b2e4-5ea41ccd031f',
        createdAt: '2022-04-19T11:13:10.825Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': '1a1a6abf-e730-4d60-b33d-702527f81563',
          comment: 'Tested participant',
          'request_presentations~attach': [
            {
              '@id': 'libindy-request-presentation-0',
              'mime-type': 'application/json',
              data: {
                base64:
                  'eyJuYW1lIjoiUHJvb2YgUmVxdWVzdCIsInZlcnNpb24iOiJQcm9vZiBSZXF1ZXN0Iiwibm9uY2UiOiI1MjY2MTI4Mjg3NjAiLCJyZXF1ZXN0ZWRfYXR0cmlidXRlcyI6eyJhZGRpdGlvbmFsUHJvcDEiOnsibmFtZXMiOlsiZk5hbWUiXSwicmVzdHJpY3Rpb25zIjpbeyJjcmVkX2RlZl9pZCI6IkxDNWFxcURQNnNCN055bjNHSG40ZUM6MzpDTDoyNDIwMTc6VUlEIn1dfX0sInJlcXVlc3RlZF9wcmVkaWNhdGVzIjp7fX0=',
              },
            },
          ],
        },
        state: 'done',
        connectionId: 'f2e80e21-f3ab-4b27-abbc-319141457a5b',
        threadId: '1a1a6abf-e730-4d60-b33d-702527f81563',
        isVerified: true,
      };

      const response = createResponse();

      jest
        .spyOn(service, 'findProofByProofRecordId')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await controller.findProofByProofRecordId(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(resData.data).toStrictEqual(result);
    });

    it('should return an presentation request required following attributes ( proof_record_id, participant_id )', async () => {
      const query = {
        proof_record_id: '',
        participant_id: '',
      };
      const serviceResult: any = [];
      const response = createResponse();
      response.status(HttpStatus.BAD_REQUEST);
      const result = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Find presentation request required following attributes ( proof_record_id, participant_id )',
      };
      jest
        .spyOn(service, 'findProofByProofRecordId')
        .mockImplementation(() => serviceResult);

      const res: any = await controller.findProofByProofRecordId(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(resData).toStrictEqual(result);
    });

    it('should return an proof presentation no data found', async () => {
      const query = {
        proof_record_id: '6703e2e3-4bb3-463d-b2e4-5ea41ccd031f',
        participant_id: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
      };
      const serviceResult: any = '';
      const result: any = { statusCode: 404, message: 'No Data found' };
      const response = createResponse();
      jest
        .spyOn(service, 'findProofByProofRecordId')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await controller.findProofByProofRecordId(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(resData.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(resData).toStrictEqual(result);
    });
  });

  describe('send presentation request', () => {
    it('should return an presentation request required following attributes ( connectionId, credential_def_id, attributes )', async () => {
      const query: SendProofRequest = {
        credentialDefId: '',
        connectionId: '',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '',
        proofRecordId: '',
      };
      const serviceResult: any = [];
      const response = createResponse();
      response.status(HttpStatus.BAD_REQUEST);
      const result = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Send presentation request required following attributes ( connectionId, credential_def_id, attributes )',
      };
      jest
        .spyOn(service, 'sendPresentationRequest')
        .mockImplementation(() => serviceResult);

      const res: any = await controller.sendPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(resData).toStrictEqual(result);
    });

    it('should return an presentation request send successfully', async () => {
      const query: SendProofRequest = {
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '',
        proofRecordId: '',
      };
      const serviceResult: any = {
        _tags: {},
        metadata: {},
        id: '03469be8-a70e-4190-952c-d1b3778e81e5',
        createdAt: '2022-04-21T10:07:10.070Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': 'caa5a5e8-8965-4457-8df0-a6db6e18617b',
          comment: 'Gaia-x Test',
          'request_presentations~attach': [[Object]],
        },
        state: 'request-sent',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        threadId: 'caa5a5e8-8965-4457-8df0-a6db6e18617b',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: 'CePQGVFWkpWBN2trZuZSx4',
      };

      const response = createResponse();

      const result: any = {
        id: 'aa74842c-6bf5-4647-864c-4c45012cfef3',
        proof_record_id: '03469be8-a70e-4190-952c-d1b3778e81e5',
        participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        credential_def_id:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        schemaId: '',
        their_did: '',
        status: 'request-sent',
        created_date: '2022-04-21T10:07:10.179Z',
        updated_date: '2022-04-21T10:07:10.179Z',
      };

      jest
        .spyOn(service, 'sendPresentationRequest')
        .mockImplementation(() => serviceResult);
      jest
        .spyOn(service, 'createPresentationRequest')
        .mockImplementation(() => result);

      const res: any = await controller.sendPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(resData.data).toStrictEqual(result);
    });

    it('should return an could not get agent details. please try again.', async () => {
      const query: SendProofRequest = {
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '',
        proofRecordId: '',
      };
      const serviceResult: any = {
        state: 'request-sent',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        threadId: 'caa5a5e8-8965-4457-8df0-a6db6e18617b',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: 'CePQGVFWkpWBN2trZuZSx4',
      };

      const response = createResponse();

      const result: any = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Could not get agent details. please try again.',
      };

      jest
        .spyOn(service, 'sendPresentationRequest')
        .mockImplementation(() => serviceResult);

      const res: any = await controller.sendPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(resData).toStrictEqual(result);
    });
  });

  describe('send out of band presentation request', () => {
    it('should return an presentation request required following attributes ( participant_id, credential_def_id, attributes )', async () => {
      const query: SendProofRequest = {
        credentialDefId: '',
        connectionId: '',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '',
        proofRecordId: '',
      };
      const serviceResult: any = [];
      const response = createResponse();
      response.status(HttpStatus.BAD_REQUEST);
      const result = {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Send presentation request required following attributes ( participant_id, credential_def_id, attributes )',
      };
      jest
        .spyOn(service, 'sendOutOfBandPresentationRequest')
        .mockImplementation(() => serviceResult);

      const res: any = await controller.sendOutOfBandPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(resData).toStrictEqual(result);
    });

    it('should return an presentation request send successfully', async () => {
      const query: SendProofRequest = {
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        proofRecordId: '',
      };
      const serviceResult: any = {
        message:
          'http://3.111.77.38:4001/?d_m=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL3ByZXNlbnQtcHJvb2YvMS4wL3JlcXVlc3QtcHJlc2VudGF0aW9uIiwiQGlkIjoiNGFlNTU0N2YtNmFmMi00MTQzLThiNWYtY2JkNWRiZWI5NGIyIiwiY29tbWVudCI6IlRlc3RlZCBCeSBTcHJpbnQgNCIsInJlcXVlc3RfcHJlc2VudGF0aW9uc35hdHRhY2giOlt7IkBpZCI6ImxpYmluZHktcmVxdWVzdC1wcmVzZW50YXRpb24tMCIsIm1pbWUtdHlwZSI6ImFwcGxpY2F0aW9uL2pzb24iLCJkYXRhIjp7ImJhc2U2NCI6ImV5SnVZVzFsSWpvaVQzVjBJRTltSUVKaGJtUWdVSEp2YjJZZ1VtVnhkV1Z6ZENJc0luWmxjbk5wYjI0aU9pSlBkWFFnVDJZZ1FtRnVaQ0JRY205dlppQlNaWEYxWlhOMElpd2libTl1WTJVaU9pSXlNamM0TURnM01UazFOakkwSWl3aWNtVnhkV1Z6ZEdWa1gyRjBkSEpwWW5WMFpYTWlPbnNpWVdSa2FYUnBiMjVoYkZCeWIzQXhJanA3SW01aGJXVnpJanBiSW1WdFlXbHNJaXdpYVhOemRXVnlSRWxFSWwwc0luSmxjM1J5YVdOMGFXOXVjeUk2VzNzaVkzSmxaRjlrWldaZmFXUWlPaUpMYm5kNk5FdEhPVGQwWVRaRmJrTTFRbFEzZFVnek9qTTZRMHc2TWpReE9UQXhPbWRoYVdFdGVDQndjbWx1WTJsd1lXd2diV1Z0WW1WeUlHTnlaV1JsYm5ScFlXd2dNQzR5SW4xZGZYMHNJbkpsY1hWbGMzUmxaRjl3Y21Wa2FXTmhkR1Z6SWpwN2ZYMD0ifX1dLCJ-c2VydmljZSI6eyJyZWNpcGllbnRLZXlzIjpbIkJCRmZVdmVVUTZjdEJUR3liWG9XWWkzNjJuS2h6NHV0WDZ4aVF3WHNzc3pRIl0sInJvdXRpbmdLZXlzIjpbXSwic2VydmljZUVuZHBvaW50IjoiaHR0cDovLzMuMTExLjc3LjM4OjQwMDEifX0',
        proofRecord: {
          _tags: {},
          metadata: {},
          id: '98c9840b-f47e-4572-8666-f17c13a6efa8',
          createdAt: '2022-04-21T11:24:43.014Z',
          requestMessage: {
            '@type':
              'https://didcomm.org/present-proof/1.0/request-presentation',
            '@id': '4ae5547f-6af2-4143-8b5f-cbd5dbeb94b2',
            comment: 'Tested By Sprint 4',
            'request_presentations~attach': [Array],
            '~service': [Object],
          },
          state: 'request-sent',
          threadId: '4ae5547f-6af2-4143-8b5f-cbd5dbeb94b2',
          autoAcceptProof: 'always',
        },
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
      };

      const response = createResponse();

      const result: any = {
        id: '4cb19a07-0a3c-4a73-bbd6-006b73b26eeb',
        proof_record_id: '98c9840b-f47e-4572-8666-f17c13a6efa8',
        participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        connectionId: '',
        credential_def_id:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        schemaId: '',
        their_did: '',
        status: 'request-sent',
        created_date: '2022-04-21T11:24:43.042Z',
        updated_date: '2022-04-21T11:24:43.042Z',
        presentationMessage:
          'http://3.111.77.38:4001/?d_m=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL3ByZXNlbnQtcHJvb2YvMS4wL3JlcXVlc3QtcHJlc2VudGF0aW9uIiwiQGlkIjoiNGFlNTU0N2YtNmFmMi00MTQzLThiNWYtY2JkNWRiZWI5NGIyIiwiY29tbWVudCI6IlRlc3RlZCBCeSBTcHJpbnQgNCIsInJlcXVlc3RfcHJlc2VudGF0aW9uc35hdHRhY2giOlt7IkBpZCI6ImxpYmluZHktcmVxdWVzdC1wcmVzZW50YXRpb24tMCIsIm1pbWUtdHlwZSI6ImFwcGxpY2F0aW9uL2pzb24iLCJkYXRhIjp7ImJhc2U2NCI6ImV5SnVZVzFsSWpvaVQzVjBJRTltSUVKaGJtUWdVSEp2YjJZZ1VtVnhkV1Z6ZENJc0luWmxjbk5wYjI0aU9pSlBkWFFnVDJZZ1FtRnVaQ0JRY205dlppQlNaWEYxWlhOMElpd2libTl1WTJVaU9pSXlNamM0TURnM01UazFOakkwSWl3aWNtVnhkV1Z6ZEdWa1gyRjBkSEpwWW5WMFpYTWlPbnNpWVdSa2FYUnBiMjVoYkZCeWIzQXhJanA3SW01aGJXVnpJanBiSW1WdFlXbHNJaXdpYVhOemRXVnlSRWxFSWwwc0luSmxjM1J5YVdOMGFXOXVjeUk2VzNzaVkzSmxaRjlrWldaZmFXUWlPaUpMYm5kNk5FdEhPVGQwWVRaRmJrTTFRbFEzZFVnek9qTTZRMHc2TWpReE9UQXhPbWRoYVdFdGVDQndjbWx1WTJsd1lXd2diV1Z0WW1WeUlHTnlaV1JsYm5ScFlXd2dNQzR5SW4xZGZYMHNJbkpsY1hWbGMzUmxaRjl3Y21Wa2FXTmhkR1Z6SWpwN2ZYMD0ifX1dLCJ-c2VydmljZSI6eyJyZWNpcGllbnRLZXlzIjpbIkJCRmZVdmVVUTZjdEJUR3liWG9XWWkzNjJuS2h6NHV0WDZ4aVF3WHNzc3pRIl0sInJvdXRpbmdLZXlzIjpbXSwic2VydmljZUVuZHBvaW50IjoiaHR0cDovLzMuMTExLjc3LjM4OjQwMDEifX0',
      };

      jest
        .spyOn(service, 'sendOutOfBandPresentationRequest')
        .mockImplementation(() => serviceResult);
      jest
        .spyOn(service, 'createPresentationRequest')
        .mockImplementation(() => result);

      const res: any = await controller.sendOutOfBandPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(resData.data).toStrictEqual(result);
    });

    it('should return an could not get agent details. please try again.', async () => {
      const query: SendProofRequest = {
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        attributes: [
          {
            attribute_name: 'email',
            value: '',
            condition: '',
          },
        ],
        participantId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        proofRecordId: '',
      };
      const serviceResult: any = {
        state: 'request-sent',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        threadId: 'caa5a5e8-8965-4457-8df0-a6db6e18617b',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: 'CePQGVFWkpWBN2trZuZSx4',
      };

      const response = createResponse();

      const result: any = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Could not get agent details. please try again.',
      };

      jest
        .spyOn(service, 'sendOutOfBandPresentationRequest')
        .mockImplementation(() => serviceResult);

      const res: any = await controller.sendOutOfBandPresentationRequest(
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(resData).toStrictEqual(result);
    });
  });

  describe('webHookCredentials()', () => {
    it('should return an presentation states noted.', async () => {
      const query: any = {
        body: {
          connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
          id: '1d50f39b-200a-460d-8198-c2dac92d813a',
          state: 'done',
          isVerified: true,
        },
      };

      const serviceResult: any = {
        state: 'request-sent',
        connectionId: '1d50f39b-200a-460d-8198-c2dac92d813a',
        threadId: 'caa5a5e8-8965-4457-8df0-a6db6e18617b',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: 'CePQGVFWkpWBN2trZuZSx4',
      };

      const result: any = {
        statusCode: HttpStatus.OK,
        message: 'Presentation states noted.',
      };

      jest
        .spyOn(service, 'updatePresentationStatus')
        .mockImplementation(() => serviceResult);

      jest
        .spyOn(service, 'makeConnectionTrusted')
        .mockImplementation(() => serviceResult);

      jest
        .spyOn(natsClient, 'makeConnectionTrusted')
        .mockResolvedValueOnce(serviceResult);

      const res: any = await controller.webhookGetProofPresentation(query);
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res).toStrictEqual(result);
    });
  });
});
