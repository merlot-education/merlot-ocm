import type { AppAgent } from '../agent.service.js';
import type { ConnectionRecord } from '@aries-framework/core';

import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';

@Injectable()
export class ConnectionService {
  public agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async getAll(): Promise<Array<ConnectionRecord>> {
    return await this.agent.connections.getAll();
  }
}
