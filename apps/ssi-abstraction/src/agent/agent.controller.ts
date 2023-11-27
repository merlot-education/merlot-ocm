import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventInfoPublicDid } from '@ocm/shared';

import { AgentService } from './agent.service.js';

@Controller('agent')
export class AgentController {
  public constructor(private agent: AgentService) {}

  @MessagePattern('info.publicDid')
  public async publicDid() {
    const didDocument = await this.agent.getPublicDid();

    return new EventInfoPublicDid({ didDocument });
  }
}
