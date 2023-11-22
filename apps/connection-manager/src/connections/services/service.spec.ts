/* eslint-disable @typescript-eslint/no-explicit-any */
import type ConnectionDto from '../entities/entity.js';
import type { TestingModule } from '@nestjs/testing';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import { NATSServices } from '../../common/constants.js';
import PrismaService from '../../prisma/prisma.service.js';

import ConnectionsService from './service.js';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let prismaService: PrismaService;
  let restClientService: RestClientService;
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
      providers: [
        ConnectionsService,
        PrismaService,
        NatsClientService,
        RestClientService,
      ],
      exports: [PrismaService],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<ConnectionsService>(ConnectionsService);
    restClientService = module.get<RestClientService>(RestClientService);
    natsClient = module.get<NatsClientService>(NatsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find Connection function', () => {
    it('find connection by connection Id', async () => {
      const repositoryResult: any = {
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
      };

      const result: any = {
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
      };

      jest
        .spyOn(prismaService.connection, 'findUnique')
        .mockResolvedValueOnce(repositoryResult);

      const res: any = await service.findConnections(
        NaN,
        -1,
        false,
        '',
        '7b821264-2ae3-4459-b45f-19fa975d91f7',
      );

      expect(res).toStrictEqual(result);
    });

    it('find connection by participant DID', async () => {
      const repositoryResult: any = {
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
      };

      const result: any = {
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
      };

      jest
        .spyOn(prismaService.connection, 'findUnique')
        .mockResolvedValueOnce(repositoryResult);

      const res: any = await service.findConnections(
        NaN,
        -1,
        '',
        '',
        'SU1SHqQiDcc6gDvqH8wwYF',
      );

      expect(res).toStrictEqual(result);
    });

    it('find connection by participant id', async () => {
      const repositoryResult: any = [
        3,
        [
          {
            id: '977c7cd6-a1af-4a5a-bd51-03758d8db50f',
            connectionId: '19694476-cc8e-42a3-a5ea-0b2503133348',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'invited',
            participantDid: 'UVE8wxzGEYGjTWWcudc2nB',
            theirDid: '',
            theirLabel: '',
            createdDate: '2022-04-22T12:15:59.365Z',
            updatedDate: '2022-04-22T12:15:59.365Z',
            isActive: true,
          },
          {
            id: 'a453d1ae-f95d-4485-8a1a-3c4347450537',
            connectionId: '24fcc8b7-3cfa-4d46-a14a-9b6297e81d7e',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'trusted',
            participantDid: '3X5jtG9CJFgsDFyXjUDRNp',
            theirDid: 'Us8ZgUGXZ5P7GTF8q5NEgh',
            theirLabel: 'tango@vomoto.com',
            createdDate: '2022-04-22T12:18:42.273Z',
            updatedDate: '2022-04-22T12:23:09.183Z',
            isActive: true,
          },
          {
            id: 'ccde23e4-5a21-44d8-a90b-beeba526d5f4',
            connectionId: 'ff468f45-7fe8-4964-abb4-d2dd90b6aed3',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'responded',
            participantDid: 'WYcecJk6ZbWvoF2VD9xTey',
            theirDid: '3NigtUWR68H3HPQiuwgfEk',
            theirLabel: 'arnold@vomoto.com',
            createdDate: '2022-04-22T12:16:03.614Z',
            updatedDate: '2022-04-22T12:16:56.132Z',
            isActive: true,
          },
        ],
      ];

      const result: any = [
        3,
        [
          {
            id: '977c7cd6-a1af-4a5a-bd51-03758d8db50f',
            connectionId: '19694476-cc8e-42a3-a5ea-0b2503133348',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'invited',
            participantDid: 'UVE8wxzGEYGjTWWcudc2nB',
            theirDid: '',
            theirLabel: '',
            createdDate: '2022-04-22T12:15:59.365Z',
            updatedDate: '2022-04-22T12:15:59.365Z',
            isActive: true,
          },
          {
            id: 'a453d1ae-f95d-4485-8a1a-3c4347450537',
            connectionId: '24fcc8b7-3cfa-4d46-a14a-9b6297e81d7e',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'trusted',
            participantDid: '3X5jtG9CJFgsDFyXjUDRNp',
            theirDid: 'Us8ZgUGXZ5P7GTF8q5NEgh',
            theirLabel: 'tango@vomoto.com',
            createdDate: '2022-04-22T12:18:42.273Z',
            updatedDate: '2022-04-22T12:23:09.183Z',
            isActive: true,
          },
          {
            id: 'ccde23e4-5a21-44d8-a90b-beeba526d5f4',
            connectionId: 'ff468f45-7fe8-4964-abb4-d2dd90b6aed3',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'responded',
            participantDid: 'WYcecJk6ZbWvoF2VD9xTey',
            theirDid: '3NigtUWR68H3HPQiuwgfEk',
            theirLabel: 'arnold@vomoto.com',
            createdDate: '2022-04-22T12:16:03.614Z',
            updatedDate: '2022-04-22T12:16:56.132Z',
            isActive: true,
          },
        ],
      ];

      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(repositoryResult);

      const res: any = await service.findConnections(NaN, -1, '', '', '');

      expect(res).toStrictEqual(result);
    });

    it.skip('find connections by participant Id and status', async () => {
      const repositoryResult = [
        3,
        [
          {
            id: '977c7cd6-a1af-4a5a-bd51-03758d8db50f',
            connectionId: '19694476-cc8e-42a3-a5ea-0b2503133348',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'invited',
            participantDid: 'UVE8wxzGEYGjTWWcudc2nB',
            theirDid: '',
            theirLabel: '',
            createdDate: '2022-04-22T12:15:59.365Z',
            updatedDate: '2022-04-22T12:15:59.365Z',
            isActive: true,
          },
          {
            id: 'a453d1ae-f95d-4485-8a1a-3c4347450537',
            connectionId: '24fcc8b7-3cfa-4d46-a14a-9b6297e81d7e',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'trusted',
            participantDid: '3X5jtG9CJFgsDFyXjUDRNp',
            theirDid: 'Us8ZgUGXZ5P7GTF8q5NEgh',
            theirLabel: 'tango@vomoto.com',
            createdDate: '2022-04-22T12:18:42.273Z',
            updatedDate: '2022-04-22T12:23:09.183Z',
            isActive: true,
          },
          {
            id: 'ccde23e4-5a21-44d8-a90b-beeba526d5f4',
            connectionId: 'ff468f45-7fe8-4964-abb4-d2dd90b6aed3',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'responded',
            participantDid: 'WYcecJk6ZbWvoF2VD9xTey',
            theirDid: '3NigtUWR68H3HPQiuwgfEk',
            theirLabel: 'arnold@vomoto.com',
            createdDate: '2022-04-22T12:16:03.614Z',
            updatedDate: '2022-04-22T12:16:56.132Z',
            isActive: true,
          },
        ],
      ];

      const result = [
        3,
        [
          {
            id: '977c7cd6-a1af-4a5a-bd51-03758d8db50f',
            connectionId: '19694476-cc8e-42a3-a5ea-0b2503133348',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'invited',
            participantDid: 'UVE8wxzGEYGjTWWcudc2nB',
            theirDid: '',
            theirLabel: '',
            createdDate: '2022-04-22T12:15:59.365Z',
            updatedDate: '2022-04-22T12:15:59.365Z',
            isActive: true,
          },
          {
            id: 'a453d1ae-f95d-4485-8a1a-3c4347450537',
            connectionId: '24fcc8b7-3cfa-4d46-a14a-9b6297e81d7e',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'trusted',
            participantDid: '3X5jtG9CJFgsDFyXjUDRNp',
            theirDid: 'Us8ZgUGXZ5P7GTF8q5NEgh',
            theirLabel: 'tango@vomoto.com',
            createdDate: '2022-04-22T12:18:42.273Z',
            updatedDate: '2022-04-22T12:23:09.183Z',
            isActive: true,
          },
          {
            id: 'ccde23e4-5a21-44d8-a90b-beeba526d5f4',
            connectionId: 'ff468f45-7fe8-4964-abb4-d2dd90b6aed3',
            participantId: '13f412e2-2749-462a-a10a-54f25e326641',
            status: 'responded',
            participantDid: 'WYcecJk6ZbWvoF2VD9xTey',
            theirDid: '3NigtUWR68H3HPQiuwgfEk',
            theirLabel: 'arnold@vomoto.com',
            createdDate: '2022-04-22T12:16:03.614Z',
            updatedDate: '2022-04-22T12:16:56.132Z',
            isActive: true,
          },
        ],
      ];

      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(repositoryResult);

      const res = await service.findConnections(
        -1,
        -1,
        'trusted,complete,responded,invited',
        undefined,
        '13f412e2-2749-462a-a10a-54f25e326641',
      );

      expect(res).toStrictEqual(result);
    });
  });

  describe.skip('create invitation', () => {
    it('Create invitation-> member flow', async () => {
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

      const agent: any = {
        status: 200,
        message: 'Agent Data',
        data: {
          service_endpoint: 'agent URL',
        },
      };

      const result = serviceResult;

      jest
        .spyOn(natsClient, 'getAgentByParticipantId')
        .mockResolvedValueOnce(agent);

      jest
        .spyOn(restClientService, 'post')
        .mockResolvedValueOnce(serviceResult);

      const res = await service.createInvitationURL(
        { autoAcceptConnection: true, alias: 'member' },
        'participantId',
      );

      expect(res).toStrictEqual(result);
    });
  });

  describe.skip('Create connection', () => {
    it('should create', async () => {
      const connectionObj: ConnectionDto = {
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
        status: 'complete',
        participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
        theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
        theirLabel: 'sagar@getnada.com',
      };

      const agent: any = {
        status: 200,
        message: 'Agent Data',
        data: {
          service_endpoint: 'agent URL',
        },
      };

      const repositoryResult: any = {
        id: '52d499e0-f76a-4b25-9c2a-f357bf6b73be',
        connectionId: '7b821264-2ae3-4459-b45f-19fa975d91f7',
        participantId: '',
        status: 'complete',
        participantDid: 'SU1SHqQiDcc6gDvqH8wwYF',
        theirDid: 'Ax9xMqE89F9LStfGnTpDzg',
        theirLabel: 'sagar@getnada.com',
        createdDate: '2022-04-27T06:55:01.643Z',
        updatedDate: '2022-04-27T06:55:01.643Z',
        isActive: true,
      };

      const result = repositoryResult;

      jest.spyOn(natsClient, 'getAgentByURL').mockResolvedValueOnce(agent);

      jest
        .spyOn(prismaService.connection, 'create')
        .mockResolvedValueOnce(repositoryResult);

      const res = await service.createConnections(connectionObj);

      expect(res).toStrictEqual(result);
    });
  });
});
