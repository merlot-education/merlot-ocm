import type { AppAgent } from '../agent.service.js';

import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';

@Injectable()
export class TenantsService {
  public agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async create(label: string) {
    return await this.agent.modules.tenants.createTenant({ config: { label } });
  }
}
