import type { AppAgent } from './agent.service.js';

import { Injectable } from '@nestjs/common';

import { AgentService } from './agent.service.js';

@Injectable()
export class WithTenantService {
  private agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public invoke<T>(
    tenantId: string,
    cb: (tenant: AppAgent) => Promise<T>,
  ): Promise<T> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<T>(async (resolve, reject) => {
      await this.agent.modules.tenants.withTenantAgent(
        { tenantId },
        async (tenant) => {
          try {
            const ret = await cb(tenant as unknown as AppAgent);
            resolve(ret);
          } catch (e) {
            reject(e);
          }
        },
      );
    });
  }
}
