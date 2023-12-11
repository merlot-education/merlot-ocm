import {
  ConnectionRecord,
  DidExchangeRole,
  DidExchangeState,
} from '@aries-framework/core';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { ConnectionsController } from '../connections.controller.js';
import { ConnectionsService } from '../connections.service.js';

describe('ConnectionsController', () => {
  let connectionsController: ConnectionsController;
  let connectionsService: ConnectionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [ConnectionsController],
      providers: [ConnectionsService],
    }).compile();

    connectionsService = moduleRef.get(ConnectionsService);
    connectionsController = moduleRef.get(ConnectionsController);
  });

  describe('get all', () => {
    it('should get all the connection records of the agent', async () => {
      const result: Array<ConnectionRecord> = [];
      jest.spyOn(connectionsService, 'getAll').mockResolvedValue(result);

      const event = await connectionsController.getAll({
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('get by id', () => {
    it('should get a connection record by id', async () => {
      const result: ConnectionRecord | null = null;
      jest.spyOn(connectionsService, 'getById').mockResolvedValue(result);

      const event = await connectionsController.getById({
        id: 'id',
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('create connection with self', () => {
    it('should create a connection with itself', async () => {
      const result: ConnectionRecord = new ConnectionRecord({
        state: DidExchangeState.Completed,
        role: DidExchangeRole.Requester,
      });

      jest
        .spyOn(connectionsService, 'createConnectionWithSelf')
        .mockResolvedValue(result);

      const event = await connectionsController.createConnectionWithSelf({
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
