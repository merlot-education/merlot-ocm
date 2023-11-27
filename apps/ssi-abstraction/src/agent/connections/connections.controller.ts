import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDidcommConnectionsGetAll } from '@ocm/shared';

import { ConnectionsService } from './connections.service.js';

@Controller('connections')
export class ConnectionsController {
  public constructor(private connectionsService: ConnectionsService) {}

  @MessagePattern('didcomm.connections.getAll')
  public async getAll(): Promise<EventDidcommConnectionsGetAll> {
    return new EventDidcommConnectionsGetAll({
      connections: await this.connectionsService.getAll(),
    });
  }
}
