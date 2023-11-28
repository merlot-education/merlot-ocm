import type { AppAgent } from '../agent.service.js';

import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';

@Injectable()
export class DidsService {
  public agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async resolve(did: string) {
    const {
      didDocument,
      didResolutionMetadata: { message, error },
    } = await this.agent.dids.resolve(did);

    if (!didDocument) {
      throw new Error(
        `Could not resolve did: '${did}'. Error: ${error ?? 'None'} Message: ${
          message ?? 'None'
        }`,
      );
    }

    return didDocument;
  }
}
