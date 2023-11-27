import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../config/__tests__/mockConfig.js';
import { AgentController } from '../agent.controller.js';
import { AgentService } from '../agent.service.js';

describe('AgentController', () => {
  let agentController: AgentController;
  let agentService: AgentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule],
      controllers: [AgentController],
      providers: [AgentService],
    }).compile();

    agentService = moduleRef.get(AgentService);
    agentController = moduleRef.get(AgentController);
  });

  describe('public did', () => {
    it('should get the public did information of the agent', async () => {
      const result = { id: 'test' };
      jest
        .spyOn(agentService, 'getPublicDid')
        .mockResolvedValue(result)

      expect(await agentController.publicDid()).toBe(result);
    });
  });
});
