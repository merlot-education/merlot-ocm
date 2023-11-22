/* eslint-disable @typescript-eslint/no-explicit-any */
import type MembershipCredentialDto from '../entities/membership-credential.dto.js';
import type SendProofRequest from '../entities/send-proof-request.dto.js';
import type { TestingModule } from '@nestjs/testing';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import { NATSServices } from '../../common/constants.js';
import PrismaService from '../../prisma/prisma.service.js';

import PresentationProofsService from './service.js';

describe.skip('ConnectionsService', () => {
  let service: PresentationProofsService;
  let prismaService: PrismaService;
  let natsClient: NatsClientService;
  let restClient: RestClientService;
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
      providers: [
        PresentationProofsService,
        PrismaService,
        NatsClientService,
        RestClientService,
      ],
      exports: [PrismaService],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<PresentationProofsService>(PresentationProofsService);
    natsClient = module.get<NatsClientService>(NatsClientService);
    restClient = module.get<RestClientService>(RestClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find proof presentation function', () => {
    it('find proof presentation by ID', async () => {
      const getAgentDetails: any = {
        statusCode: 200,
        message: 'Agent',
        data: {
          id: '15b9c7d6-8bc9-47cb-b78e-314e6c12bf16',
          participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          agent_url: 'http://3.111.77.38:4001',
          invitation_url:
            'http://3.111.77.38:4001?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiZGVhMGY1NTYtOWM4MS00OTcyLTkxZjktODhmNWQ3MDNlNDRiIiwibGFiZWwiOiJPcmdfT25lIiwicmVjaXBpZW50S2V5cyI6WyI0eFFSMVVCUXV0TGg5S2tFc1lLZ2FZNDg5VEFtMUtRTVREcnR4WEdQNnNQUiJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwMSIsInJvdXRpbmdLZXlzIjpbXX0',
          public_did: 'Knwz4KG97ta6EnC5BT7uH3',
          wallet_name: 'Org_One',
          service_endpoint: 'http://3.111.77.38:4000',
          status: true,
          created_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          created_date: '2022-04-14T16:33:14.152Z',
          updated_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          updated_date: '2022-04-26T06:03:32.178Z',
        },
      };

      const result: any = {
        _tags: {
          connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
          state: 'request-sent',
          threadId: '34881067-b9fc-49a4-814d-dee4668b4f90',
        },
        metadata: {},
        id: '117631fe-06c8-4b2c-9132-9e9f775709d8',
        createdAt: '2022-04-26T08:18:19.206Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': '34881067-b9fc-49a4-814d-dee4668b4f90',
          comment: 'Gaia-x Test',
          'request_presentations~attach': [
            {
              '@id': 'libindy-request-presentation-0',
              'mime-type': 'application/json',
              data: {
                base64:
                  'eyJuYW1lIjoiUHJvb2YgUmVxdWVzdCIsInZlcnNpb24iOiJQcm9vZiBSZXF1ZXN0Iiwibm9uY2UiOiIxMjM4NzU3NTMwMTU2IiwicmVxdWVzdGVkX2F0dHJpYnV0ZXMiOnsiYWRkaXRpb25hbFByb3AxIjp7Im5hbWVzIjpbImVtYWlsIiwiaXNzdWVyRElEIl0sInJlc3RyaWN0aW9ucyI6W3siY3JlZF9kZWZfaWQiOiJLbnd6NEtHOTd0YTZFbkM1QlQ3dUgzOjM6Q0w6MjQxOTAxOmdhaWEteCBwcmluY2lwYWwgbWVtYmVyIGNyZWRlbnRpYWwgMC4yIn1dfX0sInJlcXVlc3RlZF9wcmVkaWNhdGVzIjp7fX0=',
              },
            },
          ],
        },
        state: 'request-sent',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        threadId: '34881067-b9fc-49a4-814d-dee4668b4f90',
      };
      jest
        .spyOn(natsClient, 'getConnectionById')
        .mockResolvedValueOnce(getAgentDetails);

      jest.spyOn(restClient, 'get').mockResolvedValueOnce(result);

      const res: any = await service.findProofByProofRecordId(
        '117631fe-06c8-4b2c-9132-9e9f775709d8',
      );

      expect(res).toStrictEqual(result);
    });

    it('find connections by participant Id and status', async () => {
      const repositoryResult: any = [
        2,
        [
          {
            id: '77e98b6d-cbd0-41e4-b878-8161888ff489',
            proof_record_id: '698fa724-675b-437d-bee9-b9e86a520572',
            participant_id: '66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
            connectionId: '',
            credential_def_id:
              'S2YLfsoaWyePckkhLDqn4j:3:CL:183415:gaia-x test new test',
            schemaId: '',
            their_did: '',
            status: 'request-sent',
            created_date: '2022-04-13T13:14:10.057Z',
            updated_date: '2022-04-13T13:14:10.057Z',
          },
          {
            id: 'c02f4723-510a-4966-b3fa-de7ef6d8f1aa',
            proof_record_id: 'ab0b3681-eccb-4c5d-9c2f-4dabc1828255',
            participant_id: '66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
            connectionId: 'b213f9bd-3774-40dd-8f1f-085950c10c30',
            credential_def_id:
              'TP6CJhQ9xuPnTPpVu1kinR:3:CL:221970:gaia-x test sprint 4',
            schemaId: '',
            their_did: '',
            status: 'request-sent',
            created_date: '2022-04-08T12:53:46.193Z',
            updated_date: '2022-04-08T12:53:46.196Z',
          },
        ],
      ];

      const result: any = [
        2,
        [
          {
            id: '77e98b6d-cbd0-41e4-b878-8161888ff489',
            proof_record_id: '698fa724-675b-437d-bee9-b9e86a520572',
            participant_id: '66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
            connectionId: '',
            credential_def_id:
              'S2YLfsoaWyePckkhLDqn4j:3:CL:183415:gaia-x test new test',
            schemaId: '',
            their_did: '',
            status: 'request-sent',
            created_date: '2022-04-13T13:14:10.057Z',
            updated_date: '2022-04-13T13:14:10.057Z',
          },
          {
            id: 'c02f4723-510a-4966-b3fa-de7ef6d8f1aa',
            proof_record_id: 'ab0b3681-eccb-4c5d-9c2f-4dabc1828255',
            participant_id: '66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
            connectionId: 'b213f9bd-3774-40dd-8f1f-085950c10c30',
            credential_def_id:
              'TP6CJhQ9xuPnTPpVu1kinR:3:CL:221970:gaia-x test sprint 4',
            schemaId: '',
            their_did: '',
            status: 'request-sent',
            created_date: '2022-04-08T12:53:46.193Z',
            updated_date: '2022-04-08T12:53:46.196Z',
          },
        ],
      ];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(repositoryResult);

      const res: any = await service.findProofPresentation(0, 0);

      expect(res).toStrictEqual(result);
    });
  });

  describe('create presentation request function', () => {
    it('create presentation request', async () => {
      const serviceDto: any = [
        {
          proof_record_id: '698fa724-675b-437d-bee9-b9e86a520572',
          participant_id: '66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
          connectionId: '',
          credential_def_id:
            'S2YLfsoaWyePckkhLDqn4j:3:CL:183415:gaia-x test new test',
          schemaId: '',
          status: 'request-sent',
          created_date: '2022-04-13T13:14:10.057Z',
          updated_date: '2022-04-13T13:14:10.057Z',
        },
      ];

      const repositoryResult: any = {
        id: 'c7e06b9e-d796-4a54-b8f2-9746d3188c97',
        proof_record_id: '117631fe-06c8-4b2c-9132-9e9f775709d8',
        participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        credential_def_id:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        schemaId: '',
        their_did: '',
        status: 'request-sent',
        created_date: '2022-04-26T08:18:18.644Z',
        updated_date: '2022-04-26T08:18:18.646Z',
      };

      const result: any = {
        id: 'c7e06b9e-d796-4a54-b8f2-9746d3188c97',
        proof_record_id: '117631fe-06c8-4b2c-9132-9e9f775709d8',
        participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        credential_def_id:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        schemaId: '',
        their_did: '',
        status: 'request-sent',
        created_date: '2022-04-26T08:18:18.644Z',
        updated_date: '2022-04-26T08:18:18.646Z',
      };

      jest
        .spyOn(prismaService.proof, 'create')
        .mockResolvedValueOnce(repositoryResult);

      const res: any = await service.createPresentationRequest(serviceDto);
      expect(res).toStrictEqual(result);
    });
  });

  describe('send presentation request function', () => {
    it('send presentation request', async () => {
      const serviceDto: SendProofRequest = {
        comment: 'Gaia-x Test',
        attributes: [
          {
            attributeName: 'email',
            value: '',
            condition: '',
          },
          {
            attributeName: 'issuerDID',
            value: '',
            condition: '',
          },
        ],
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        participantId: '',
        proofRecordId: '',
      };

      const getAgentDetails: any = {
        statusCode: 200,
        message: 'Agent',
        data: {
          id: '15b9c7d6-8bc9-47cb-b78e-314e6c12bf16',
          participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          agent_url: 'http://3.111.77.38:4001',
          invitation_url:
            'http://3.111.77.38:4001?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiZGVhMGY1NTYtOWM4MS00OTcyLTkxZjktODhmNWQ3MDNlNDRiIiwibGFiZWwiOiJPcmdfT25lIiwicmVjaXBpZW50S2V5cyI6WyI0eFFSMVVCUXV0TGg5S2tFc1lLZ2FZNDg5VEFtMUtRTVREcnR4WEdQNnNQUiJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwMSIsInJvdXRpbmdLZXlzIjpbXX0',
          public_did: 'Knwz4KG97ta6EnC5BT7uH3',
          wallet_name: 'Org_One',
          service_endpoint: 'http://3.111.77.38:4000',
          status: true,
          created_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          created_date: '2022-04-14T16:33:14.152Z',
          updated_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          updated_date: '2022-04-26T06:03:32.178Z',
        },
      };

      const natsConnectionIdResponce: any = {
        id: '480f4738-3d34-4b80-8160-d59e7ad91b52',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        status: 'complete',
        participantDid: 'SQVgKy9CHSYN2TLRsg999E',
        theirDid: '4D9hPSoWZLCkrCr57pqMqs',
        theirLabel: 'Org_Two',
        createdDate: '2022-04-26T08:17:45.295Z',
        updatedDate: '2022-04-26T08:18:02.218Z',
        isActive: false,
      };

      const result: any = {
        _tags: {},
        metadata: {},
        id: '10ff9df7-c98b-48d4-b540-d5df0d91f7cd',
        createdAt: '2022-04-26T10:02:59.310Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
          comment: 'Gaia-x Test',
          'request_presentations~attach': [[Object]],
        },
        state: 'request-sent',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        threadId: 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: '4D9hPSoWZLCkrCr57pqMqs',
      };

      jest
        .spyOn(natsClient, 'getConnectionById')
        .mockResolvedValueOnce(natsConnectionIdResponce);

      jest
        .spyOn(natsClient, 'getConnectionById')
        .mockResolvedValueOnce(getAgentDetails);

      jest.spyOn(restClient, 'post').mockResolvedValueOnce(result);

      const res: any = await service.sendPresentationRequest(serviceDto);

      expect(res).toStrictEqual(result);
    });
  });

  describe('send out of band presentation request function', () => {
    it('send out of band presentation request', async () => {
      const serviceDto: SendProofRequest = {
        comment: 'Gaia-x Test',
        attributes: [
          {
            attributeName: 'email',
            value: '',
            condition: '',
          },
          {
            attributeName: 'issuerDID',
            value: '',
            condition: '',
          },
        ],
        credentialDefId:
          'Knwz4KG97ta6EnC5BT7uH3:3:CL:241901:gaia-x principal member credential 0.2',
        connectionId: '',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        proofRecordId: '',
      };

      const getAgentDetails: any = {
        statusCode: 200,
        message: 'Agent',
        data: {
          id: '15b9c7d6-8bc9-47cb-b78e-314e6c12bf16',
          participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          agent_url: 'http://3.111.77.38:4001',
          invitation_url:
            'http://3.111.77.38:4001?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiZGVhMGY1NTYtOWM4MS00OTcyLTkxZjktODhmNWQ3MDNlNDRiIiwibGFiZWwiOiJPcmdfT25lIiwicmVjaXBpZW50S2V5cyI6WyI0eFFSMVVCUXV0TGg5S2tFc1lLZ2FZNDg5VEFtMUtRTVREcnR4WEdQNnNQUiJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwMSIsInJvdXRpbmdLZXlzIjpbXX0',
          public_did: 'Knwz4KG97ta6EnC5BT7uH3',
          wallet_name: 'Org_One',
          service_endpoint: 'http://3.111.77.38:4000',
          status: true,
          created_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          created_date: '2022-04-14T16:33:14.152Z',
          updated_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          updated_date: '2022-04-26T06:03:32.178Z',
        },
      };

      const result: any = {
        _tags: {},
        metadata: {},
        id: '10ff9df7-c98b-48d4-b540-d5df0d91f7cd',
        createdAt: '2022-04-26T10:02:59.310Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
          comment: 'Gaia-x Test',
          'request_presentations~attach': [[Object]],
        },
        state: 'request-sent',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        threadId: 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: '4D9hPSoWZLCkrCr57pqMqs',
      };

      jest
        .spyOn(natsClient, 'getConnectionById')
        .mockResolvedValueOnce(getAgentDetails);

      jest.spyOn(restClient, 'post').mockResolvedValueOnce(result);

      const res: any =
        await service.sendOutOfBandPresentationRequest(serviceDto);

      expect(res).toStrictEqual(result);
    });
  });

  describe('send membership credential presentation request function', () => {
    it('send membership credential presentation request', async () => {
      const serviceDto: MembershipCredentialDto = {
        attributes: [
          {
            attributeName: 'email',
          },
          {
            attributeName: 'issuerDID',
          },
        ],
        connectionId: '',
        participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        schemaId: '',
      };

      const getAgentDetails: any = {
        statusCode: 200,
        message: 'Agent',
        data: {
          id: '15b9c7d6-8bc9-47cb-b78e-314e6c12bf16',
          participant_id: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          agent_url: 'http://3.111.77.38:4001',
          invitation_url:
            'http://3.111.77.38:4001?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiZGVhMGY1NTYtOWM4MS00OTcyLTkxZjktODhmNWQ3MDNlNDRiIiwibGFiZWwiOiJPcmdfT25lIiwicmVjaXBpZW50S2V5cyI6WyI0eFFSMVVCUXV0TGg5S2tFc1lLZ2FZNDg5VEFtMUtRTVREcnR4WEdQNnNQUiJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwMSIsInJvdXRpbmdLZXlzIjpbXX0',
          public_did: 'Knwz4KG97ta6EnC5BT7uH3',
          wallet_name: 'Org_One',
          service_endpoint: 'http://3.111.77.38:4000',
          status: true,
          created_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          created_date: '2022-04-14T16:33:14.152Z',
          updated_by: '662dc769-a4de-4c95-934c-f6dab8cf432c',
          updated_date: '2022-04-26T06:03:32.178Z',
        },
      };

      const result: any = {
        _tags: {},
        metadata: {},
        id: '10ff9df7-c98b-48d4-b540-d5df0d91f7cd',
        createdAt: '2022-04-26T10:02:59.310Z',
        requestMessage: {
          '@type': 'https://didcomm.org/present-proof/1.0/request-presentation',
          '@id': 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
          comment: 'Gaia-x Test',
          'request_presentations~attach': [[Object]],
        },
        state: 'request-sent',
        connectionId: 'b6724f85-a633-43ee-9c1c-736eaccbb6f9',
        threadId: 'cb5df550-36a4-4cba-8afc-3b89cedbc6bb',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        theirDid: '4D9hPSoWZLCkrCr57pqMqs',
      };

      jest
        .spyOn(natsClient, 'getConnectionById')
        .mockResolvedValueOnce(getAgentDetails);

      jest.spyOn(restClient, 'post').mockResolvedValueOnce(result);

      const res: any =
        await service.sendPrincipalCredentialPresentationRequest(serviceDto);

      expect(res).toStrictEqual(result);
    });
  });
});
