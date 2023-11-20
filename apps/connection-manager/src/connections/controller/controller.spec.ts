import { HttpModule } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import httpMocks from 'node-mocks-http';
import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import { NATSServices } from '../../common/constants.js';
import PrismaService from '../../prisma/prisma.service.js';
import type ConnectionStateDto from '../entities/connectionStateDto.entity.js';
import ConnectionsService from '../services/service.js';

import ConnectionsController from './controller.js';

describe.skip('ConnectionsController', () => {
  let connectionController: ConnectionsController;
  let connectionService: ConnectionsService;
  // const connection = new ConnectionDto();
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
      controllers: [ConnectionsController],
      providers: [
        ConnectionsService,
        PrismaService,
        NatsClientService,
        RestClientService,
      ],
      exports: [PrismaService],
    }).compile();
    connectionService = module.get<ConnectionsService>(ConnectionsService);
    connectionController = module.get<ConnectionsController>(
      ConnectionsController,
    );
  });
  it('should be defined', () => {
    expect(connectionController).toBeDefined();
  });

  describe('Get all connections', () => {
    it('should return an array of connection', async () => {
      const param = {};
      const query = {
        pageSize: '0',
        page: '0',
        participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
      };
      const serviceResult: any = [
        1,
        {
          id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
          connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
          participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          status: 'trusted',
          participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
          theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
          theirLabel: 'sagar@getnada.com',
          createdDate: '2022-04-18T11:03:58.099Z',
          updatedDate: '2022-04-18T11:05:10.004Z',
          isActive: true,
        },
      ];

      const result: any = {
        count: 1,
        records: {
          id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
          connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
          participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          status: 'trusted',
          participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
          theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
          theirLabel: 'sagar@getnada.com',
          createdDate: '2022-04-18T11:03:58.099Z',
          updatedDate: '2022-04-18T11:05:10.004Z',
          isActive: true,
        },
      };

      const response = httpMocks.createResponse();

      jest
        .spyOn(connectionService, 'findConnections')
        .mockResolvedValueOnce(serviceResult);

      const res: any = await connectionController.getConnection(
        param,
        response,
      );

      const resData = res._getData();

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(JSON.parse(resData).data).toStrictEqual(result);
    });

    it('If Not provided required parameter response should be bad request', async () => {
      const param = {};
      const query = {
        pageSize: '0',
        page: '0',
      };
      const serviceResult: any = [
        1,
        {
          id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
          connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
          participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          status: 'trusted',
          participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
          theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
          theirLabel: 'sagar@getnada.com',
          createdDate: '2022-04-18T11:03:58.099Z',
          updatedDate: '2022-04-18T11:05:10.004Z',
          isActive: true,
        },
      ];

      const response = httpMocks.createResponse();

      jest
        .spyOn(connectionService, 'findConnections')
        .mockResolvedValueOnce(serviceResult);

      const res = await connectionController.getConnection(param, response);
      const resData = res._getData();

      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(JSON.parse(resData).message).toStrictEqual(
        'Participant ID/ connection ID / participant DID must be provided',
      );
    });

    it('Get connection against connection id', async () => {
      const param = {
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
      };
      const query = {};
      const serviceResult: any = {
        id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
        status: 'trusted',
        participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
        theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
        theirLabel: 'sagar@getnada.com',
        createdDate: '2022-04-18T11:03:58.099Z',
        updatedDate: '2022-04-18T11:05:10.004Z',
        isActive: true,
      };

      const result: any = {
        statusCode: 200,
        message: 'Connections fetch successfully',
        data: {
          records: {
            id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
            connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
            participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
            status: 'trusted',
            participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
            theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
            theirLabel: 'sagar@getnada.com',
            createdDate: '2022-04-18T11:03:58.099Z',
            updatedDate: '2022-04-18T11:05:10.004Z',
            isActive: true,
          },
        },
      };

      const response = httpMocks.createResponse();
      jest
        .spyOn(connectionService, 'findConnections')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.getConnection(
        param,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(JSON.parse(resData)).toStrictEqual(result);
    });

    it('Not fount if data is not present against connection id', async () => {
      const param = {
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
      };
      const query = {};
      const serviceResult: any = {
        id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
        status: 'trusted',
        participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
        theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
        theirLabel: 'sagar@getnada.com',
        createdDate: '2022-04-18T11:03:58.099Z',
        updatedDate: '2022-04-18T11:05:10.004Z',
        isActive: false,
      };

      const result: any = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No Data found',
      };

      const response = httpMocks.createResponse();
      jest
        .spyOn(connectionService, 'findConnections')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.getConnection(
        param,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(JSON.parse(resData)).toStrictEqual(result);
    });

    it('should return an array of connection with status filter', async () => {
      const param = {};
      const query = {
        pageSize: '0',
        page: '0',
        participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
        status: 'trusted,complete',
      };
      const serviceResult: any = [
        1,
        {
          id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
          connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
          participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          status: 'trusted',
          participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
          theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
          theirLabel: 'sagar@getnada.com',
          createdDate: '2022-04-18T11:03:58.099Z',
          updatedDate: '2022-04-18T11:05:10.004Z',
          isActive: true,
        },
      ];

      const result: any = {
        count: 1,
        records: {
          id: '1a7f0b09-b20e-4971-b9b1-7adde7256bbc',
          connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
          participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
          status: 'trusted',
          participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
          theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
          theirLabel: 'sagar@getnada.com',
          createdDate: '2022-04-18T11:03:58.099Z',
          updatedDate: '2022-04-18T11:05:10.004Z',
          isActive: true,
        },
      };

      const response = httpMocks.createResponse();
      jest
        .spyOn(connectionService, 'findConnections')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.getConnection(
        param,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(JSON.parse(resData).data).toStrictEqual(result);
    });
  });

  describe('Connection webhook calls', () => {
    it('Create connection webhook call', async () => {
      const webHook: ConnectionStateDto = {
        _tags: {},
        metadata: {},
        id: '7edc871d-9fa3-4f30-8763-59c80bf346f5',
        createdAt: '2022-04-21T10:52:27.151Z',
        did: 'DD8Aue5tuohjBaCLM9GMU7',
        didDoc: {
          '@context': 'https://w3id.org/did/v1',
          publicKey: [
            [
              {
                id: 'C1buxAXWiisjFpVVyUGM5D#1',
                controller: 'C1buxAXWiisjFpVVyUGM5D',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: '714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y',
              },
            ],
          ],
          service: [
            {
              id: 'C1buxAXWiisjFpVVyUGM5D#IndyAgentService',
              serviceEndpoint: 'http://localhost:4011',
              type: 'IndyAgent',
              priority: 0,
              recipientKeys: ['714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y'],
              routingKeys: [],
            },
          ],
          authentication: [[Object]],
          id: 'DD8Aue5tuohjBaCLM9GMU7',
        },
        theirDid: '',
        theirLabel: '',
        verkey: '7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX',
        state: 'invited',
        role: 'inviter',
        alias: 'member',
        invitation: {
          '@type': 'https://didcomm.org/connections/1.0/invitation',
          '@id': '8578735f-eef8-4748-b791-ba2f8f7002e2',
          label: 'State_University',
          recipientKeys: ['7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX'],
          serviceEndpoint: 'http://localhost:4017',
          routingKeys: [],
        },
        multiUseInvitation: false,
      };
      const serviceResult: any = {};
      jest
        .spyOn(connectionService, 'createConnections')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.createConnection({
        body: webHook,
      });

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      // expect(JSON.parse(resData).data).toStrictEqual(result);
    });

    it('Update connection webhook call -> member flow', async () => {
      const webHook: ConnectionStateDto = {
        _tags: {},
        metadata: {},
        id: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        createdAt: '2022-04-21T10:52:27.151Z',
        did: 'DD8Aue5tuohjBaCLM9GMU7',
        didDoc: {
          '@context': 'https://w3id.org/did/v1',
          publicKey: [
            [
              {
                id: 'C1buxAXWiisjFpVVyUGM5D#1',
                controller: 'C1buxAXWiisjFpVVyUGM5D',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: '714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y',
              },
            ],
          ],
          service: [
            {
              id: 'C1buxAXWiisjFpVVyUGM5D#IndyAgentService',
              serviceEndpoint: 'http://localhost:4011',
              type: 'IndyAgent',
              priority: 0,
              recipientKeys: ['714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y'],
              routingKeys: [],
            },
          ],
          authentication: [[Object]],
          id: 'DD8Aue5tuohjBaCLM9GMU7',
        },
        theirDid: '',
        theirLabel: '',
        verkey: '7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX',
        state: 'complete',
        role: 'inviter',
        alias: 'member',
        invitation: {
          '@type': 'https://didcomm.org/connections/1.0/invitation',
          '@id': '8578735f-eef8-4748-b791-ba2f8f7002e2',
          label: 'State_University',
          recipientKeys: ['7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX'],
          serviceEndpoint: 'http://localhost:4017',
          routingKeys: [],
        },
        multiUseInvitation: false,
      };

      const restConnection: any = {
        id: '29701e41-60e8-4fca-8504-ea3bcefa6486',
        connectionId: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        status: 'trusted',
        participantDid: 'PyLDJRKzmKmJShyEtjC4AQ',
        theirDid: 'UgR1Rrp6p3VJGwLFZnBdwB',
        theirLabel: 'Attest12',
        createdDate: '2022-04-15T11:30:04.660Z',
        updatedDate: '2022-04-15T11:36:58.560Z',
        isActive: true,
      };
      const serviceResult: any = {};
      jest
        .spyOn(connectionService, 'updateStatusByConnectionId')
        .mockResolvedValueOnce(serviceResult);

      jest
        .spyOn(connectionService, 'getConnectionByID')
        .mockResolvedValueOnce(restConnection);
      const res: any = await connectionController.createConnection({
        body: webHook,
      });

      expect(res.statusCode).toBe(HttpStatus.OK);
      // expect(JSON.parse(resData).data).toStrictEqual(result);
    });

    it('Update connection webhook call -> subscriber flow', async () => {
      const webHook: ConnectionStateDto = {
        _tags: {},
        metadata: {},
        id: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        createdAt: '2022-04-21T10:52:27.151Z',
        did: 'DD8Aue5tuohjBaCLM9GMU7',
        didDoc: {
          '@context': 'https://w3id.org/did/v1',
          publicKey: [
            [
              {
                id: 'C1buxAXWiisjFpVVyUGM5D#1',
                controller: 'C1buxAXWiisjFpVVyUGM5D',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: '714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y',
              },
            ],
          ],
          service: [
            {
              id: 'C1buxAXWiisjFpVVyUGM5D#IndyAgentService',
              serviceEndpoint: 'http://localhost:4011',
              type: 'IndyAgent',
              priority: 0,
              recipientKeys: ['714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y'],
              routingKeys: [],
            },
          ],
          authentication: [[Object]],
          id: 'DD8Aue5tuohjBaCLM9GMU7',
        },
        theirDid: '',
        theirLabel: '',
        verkey: '7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX',
        state: 'complete',
        role: 'inviter',
        alias: 'subscriber',
        invitation: {
          '@type': 'https://didcomm.org/connections/1.0/invitation',
          '@id': '8578735f-eef8-4748-b791-ba2f8f7002e2',
          label: 'State_University',
          recipientKeys: ['7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX'],
          serviceEndpoint: 'http://localhost:4017',
          routingKeys: [],
        },
        multiUseInvitation: false,
      };

      const restConnection: any = {
        id: '29701e41-60e8-4fca-8504-ea3bcefa6486',
        connectionId: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        status: 'trusted',
        participantDid: 'PyLDJRKzmKmJShyEtjC4AQ',
        theirDid: 'UgR1Rrp6p3VJGwLFZnBdwB',
        theirLabel: 'Attest12',
        createdDate: '2022-04-15T11:30:04.660Z',
        updatedDate: '2022-04-15T11:36:58.560Z',
        isActive: true,
      };
      const serviceResult: any = {};
      jest
        .spyOn(connectionService, 'updateStatusByConnectionId')
        .mockResolvedValueOnce(serviceResult);

      jest
        .spyOn(connectionService, 'getConnectionByID')
        .mockResolvedValueOnce(restConnection);
      const res: any = await connectionController.createConnection({
        body: webHook,
      });

      expect(res.statusCode).toBe(HttpStatus.OK);
      // expect(JSON.parse(resData).data).toStrictEqual(result);
    });

    it('Connection webhook call with wrong role', async () => {
      const webHook: ConnectionStateDto = {
        _tags: {},
        metadata: {},
        id: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        createdAt: '2022-04-21T10:52:27.151Z',
        did: 'DD8Aue5tuohjBaCLM9GMU7',
        didDoc: {
          '@context': 'https://w3id.org/did/v1',
          publicKey: [
            [
              {
                id: 'C1buxAXWiisjFpVVyUGM5D#1',
                controller: 'C1buxAXWiisjFpVVyUGM5D',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: '714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y',
              },
            ],
          ],
          service: [
            {
              id: 'C1buxAXWiisjFpVVyUGM5D#IndyAgentService',
              serviceEndpoint: 'http://localhost:4011',
              type: 'IndyAgent',
              priority: 0,
              recipientKeys: ['714U4GdQqyeqhCANgJmTrGqUPg4QTGuEhJcEGYAvEH1Y'],
              routingKeys: [],
            },
          ],
          authentication: [[Object]],
          id: 'DD8Aue5tuohjBaCLM9GMU7',
        },
        theirDid: '',
        theirLabel: '',
        verkey: '7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX',
        state: 'complete',
        role: 'invitee',
        alias: 'subscriber',
        invitation: {
          '@type': 'https://didcomm.org/connections/1.0/invitation',
          '@id': '8578735f-eef8-4748-b791-ba2f8f7002e2',
          label: 'State_University',
          recipientKeys: ['7exBgFhenY8hqBwBF56D8sp6akLstqXxS1MUUCpDErvX'],
          serviceEndpoint: 'http://localhost:4017',
          routingKeys: [],
        },
        multiUseInvitation: false,
      };

      const restConnection = {
        id: '29701e41-60e8-4fca-8504-ea3bcefa6486',
        connectionId: '72534911-9be0-4e3f-8539-2a8a09e4e409',
        participantId: '662dc769-a4de-4c95-934c-f6dab8cf432c',
        status: 'trusted',
        participantDid: 'PyLDJRKzmKmJShyEtjC4AQ',
        theirDid: 'UgR1Rrp6p3VJGwLFZnBdwB',
        theirLabel: 'Attest12',
        createdDate: '2022-04-15T11:30:04.660Z',
        updatedDate: '2022-04-15T11:36:58.560Z',
        isActive: true,
      };
      const serviceResult = {};

      jest
        .spyOn(connectionService, 'updateStatusByConnectionId')
        .mockResolvedValueOnce(serviceResult);

      jest
        .spyOn(connectionService, 'getConnectionByID')
        .mockResolvedValueOnce(restConnection);
      const res = await connectionController.createConnection({
        body: webHook,
      });

      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      // expect(JSON.parse(resData).data).toStrictEqual(result);
    });
  });

  describe('Get invitation URL', () => {
    it('Get Member invitation URL', async () => {
      const body = {
        autoAcceptConnection: true,
      };
      const query = {
        participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
        process: 'member',
      };
      const serviceResult: any = {
        invitationUrl:
          'http://localhost:4005?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiYWMzYjE0NjktY2Y0Ni00M2ZjLWE4M2EtZGNmZjJjMDA1YjRlIiwibGFiZWwiOiJ0ZWNobmljYV9jb3JwIiwicmVjaXBpZW50S2V5cyI6WyI1bml1NWZmZmVnYkZlS2F3bU5OblRBTEpzaHB1cXpjRm5CUGpBOFFWU2dtWCJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwNSIsInJvdXRpbmdLZXlzIjpbXX0',
        invitation: {
          '@type':
            'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
          '@id': 'ac3b1469-cf46-43fc-a83a-dcff2c005b4e',
          label: 'technica_corp',
          recipientKeys: ['5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX'],
          serviceEndpoint: 'http://localhost:4005',
          routingKeys: [],
        },
        connection: {
          _tags: {},
          metadata: {},
          id: 'c1d73d9e-6988-4c84-9ebc-068c265d2fb6',
          createdAt: '2022-04-21T10:52:18.161Z',
          did: '9nYw7CSdHPqXf6ayfA7Wo2',
          didDoc: {
            '@context': 'https://w3id.org/did/v1',
            publicKey: [
              {
                id: '9nYw7CSdHPqXf6ayfA7Wo2#1',
                controller: '9nYw7CSdHPqXf6ayfA7Wo2',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: '5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX',
              },
            ],
            service: [
              {
                id: '9nYw7CSdHPqXf6ayfA7Wo2#In7780cd24-af13-423e-b1ff-ae944ab6fd71dyAgentService',
                serviceEndpoint: 'http://localhost:4005',
                type: 'IndyAgent',
                priority: 0,
                recipientKeys: ['5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX'],
                routingKeys: [],
              },
            ],
            authentication: [
              {
                publicKey: '9nYw7CSdHPqXf6ayfA7Wo2#1',
                type: 'Ed25519SignatureAuthentication2018',
              },
            ],
            id: '9nYw7CSdHPqXf6ayfA7Wo2',
          },
          verkey: '5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX',
          state: 'invited',
          role: 'inviter',
          alias: 'member',
          autoAcceptConnection: true,
          invitation: {
            '@type': 'https://didcomm.org/connections/1.0/invitation',
            '@id': 'ac3b1469-cf46-43fc-a83a-dcff2c005b4e',
            label: 'technica_corp',
            recipientKeys: ['5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX'],
            serviceEndpoint: 'http://localhost:4005',
            routingKeys: [],
          },
          multiUseInvitation: false,
        },
      };

      const result: any = {
        statusCode: 200,
        message: 'Connection created successfully',
        data: {
          invitationUrl:
            'http://localhost:4005?c_i=eyJAdHlwZSI6ImRpZDpzb3Y6QnpDYnNOWWhNcmpIaXFaRFRVQVNIZztzcGVjL2Nvbm5lY3Rpb25zLzEuMC9pbnZpdGF0aW9uIiwiQGlkIjoiYWMzYjE0NjktY2Y0Ni00M2ZjLWE4M2EtZGNmZjJjMDA1YjRlIiwibGFiZWwiOiJ0ZWNobmljYV9jb3JwIiwicmVjaXBpZW50S2V5cyI6WyI1bml1NWZmZmVnYkZlS2F3bU5OblRBTEpzaHB1cXpjRm5CUGpBOFFWU2dtWCJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMy4xMTEuNzcuMzg6NDAwNSIsInJvdXRpbmdLZXlzIjpbXX0',
          invitation: {
            '@type':
              'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
            '@id': 'ac3b1469-cf46-43fc-a83a-dcff2c005b4e',
            label: 'technica_corp',
            recipientKeys: ['5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX'],
            serviceEndpoint: 'http://localhost:4005',
            routingKeys: [],
          },
          connection: {
            _tags: {},
            metadata: {},
            id: 'c1d73d9e-6988-4c84-9ebc-068c265d2fb6',
            createdAt: '2022-04-21T10:52:18.161Z',
            did: '9nYw7CSdHPqXf6ayfA7Wo2',
            didDoc: {
              '@context': 'https://w3id.org/did/v1',
              publicKey: [
                {
                  id: '9nYw7CSdHPqXf6ayfA7Wo2#1',
                  controller: '9nYw7CSdHPqXf6ayfA7Wo2',
                  type: 'Ed25519VerificationKey2018',
                  publicKeyBase58:
                    '5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX',
                },
              ],
              service: [
                {
                  id: '9nYw7CSdHPqXf6ayfA7Wo2#In7780cd24-af13-423e-b1ff-ae944ab6fd71dyAgentService',
                  serviceEndpoint: 'http://localhost:4005',
                  type: 'IndyAgent',
                  priority: 0,
                  recipientKeys: [
                    '5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX',
                  ],
                  routingKeys: [],
                },
              ],
              authentication: [
                {
                  publicKey: '9nYw7CSdHPqXf6ayfA7Wo2#1',
                  type: 'Ed25519SignatureAuthentication2018',
                },
              ],
              id: '9nYw7CSdHPqXf6ayfA7Wo2',
            },
            verkey: '5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX',
            state: 'invited',
            role: 'inviter',
            alias: 'member',
            autoAcceptConnection: true,
            invitation: {
              '@type': 'https://didcomm.org/connections/1.0/invitation',
              '@id': 'ac3b1469-cf46-43fc-a83a-dcff2c005b4e',
              label: 'technica_corp',
              recipientKeys: ['5niu5fffegbFeKawmNNnTALJshpuqzcFnBPjA8QVSgmX'],
              serviceEndpoint: 'http://localhost:4005',
              routingKeys: [],
            },
            multiUseInvitation: false,
          },
        },
      };

      const response = httpMocks.createResponse();
      jest
        .spyOn(connectionService, 'createInvitationURL')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.createConnectionInvitation(
        body,
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(resData).toStrictEqual(result);
    });

    it('Get Member invitation URL-> Agent is not present', async () => {
      const body = {
        autoAcceptConnection: true,
      };
      const query = {
        participantId: '7780cd24-af13-423e-b1ff-ae944ab6fd71',
        process: 'member',
      };
      const serviceResult: any = undefined;

      const result: any = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Agent Data not found.',
      };

      const response = httpMocks.createResponse();
      jest
        .spyOn(connectionService, 'createInvitationURL')
        .mockResolvedValueOnce(serviceResult);
      const res: any = await connectionController.createConnectionInvitation(
        body,
        query,
        response,
      );
      // eslint-disable-next-line no-underscore-dangle
      const resData = res._getData();
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(resData).toStrictEqual(result);
    });
  });
});
