import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ConnectionsService } from './connections.service.js';

@Controller('connections')
export class ConnectionsController {
  public constructor(private connectionsService: ConnectionsService) {}

  @MessagePattern('didcomm.connections.getAll')
  public async getAll() {
    return await this.connectionsService.getAll();
  }
}
