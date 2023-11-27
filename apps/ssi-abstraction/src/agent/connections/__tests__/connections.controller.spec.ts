import type { ConnectionRecord } from '@aries-framework/core';

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
      imports: [mockConfigModule, AgentModule],
      controllers: [ConnectionsController],
      providers: [ConnectionsService],
    }).compile();

    connectionsService = moduleRef.get(ConnectionsService);
    connectionsController = moduleRef.get(ConnectionsController);
  });

  describe('get all', () => {
    it('should get all the connection records of the agent', async () => {
      const result: Array<ConnectionRecord> = [];
      jest
        .spyOn(connectionsService, 'getAll')
        .mockImplementation(() => Promise.resolve(result));

      const connectionsEvent = await connectionsController.getAll();

      expect(connectionsEvent.data).toStrictEqual({ connections: result });
    });
  });
});
