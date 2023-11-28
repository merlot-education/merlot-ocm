import { DidDocument } from '@aries-framework/core';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { DidsController } from '../dids.controller.js';
import { DidsService } from '../dids.service.js';

describe('DidsController', () => {
  let didsController: DidsController;
  let didsService: DidsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [DidsController],
      providers: [DidsService],
    }).compile();

    didsService = moduleRef.get(DidsService);
    didsController = moduleRef.get(DidsController);
  });

  describe('resolve', () => {
    it('should resolve a basic did', async () => {
      const result = new DidDocument({ id: 'did:key:foo' });
      jest.spyOn(didsService, 'resolve').mockResolvedValue(result);

      const event = await didsController.resolve({
        did: 'did:key:foo',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
