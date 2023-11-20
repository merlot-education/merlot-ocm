import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AgentService } from './agent.service.js';

@Controller('agent')
export class AgentController {
  public constructor(private agent: AgentService) {}

  @MessagePattern('info.publicDid')
  async publicDid() {
    return {
      id: 'test',
    };
  }
}
