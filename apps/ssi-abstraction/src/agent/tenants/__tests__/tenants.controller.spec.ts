import { TenantRecord } from '@aries-framework/tenants';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { TenantsController } from '../tenants.controller.js';
import { TenantsService } from '../tenants.service.js';

describe('TenantsController', () => {
  let tenantsController: TenantsController;
  let tenantsService: TenantsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [TenantsController],
      providers: [TenantsService],
    }).compile();

    tenantsService = moduleRef.get(TenantsService);
    tenantsController = moduleRef.get(TenantsController);
  });

  describe('resolve', () => {
    it('should resolve a basic did', async () => {
      const result = new TenantRecord({
        config: {
          label: 'my-label',
          walletConfig: { key: 'some-key', id: 'some-id' },
        },
      });
      jest.spyOn(tenantsService, 'create').mockResolvedValue(result);

      const event = await tenantsController.create({
        label: 'my-label',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
