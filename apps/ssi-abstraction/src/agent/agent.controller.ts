import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  public constructor(private agent: AgentService) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('info')
  async getWalletInfo() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: 'SHOULD_BE_PUBLIC_DID',
    };
  }
}

export default AgentController;
