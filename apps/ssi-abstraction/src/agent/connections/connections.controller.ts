import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetByIdInput,
  EventDidcommConnectionsCreateWithSelfInput,
  EventDidcommConnectionsBlockInput,
} from '@ocm/shared';

import { ConnectionsService } from './connections.service.js';

@Controller('connections')
export class ConnectionsController {
  public constructor(private connectionsService: ConnectionsService) {}

  @MessagePattern(EventDidcommConnectionsGetAll.token)
  public async getAll(
    options: EventDidcommConnectionsGetAllInput,
  ): Promise<EventDidcommConnectionsGetAll> {
    return new EventDidcommConnectionsGetAll(
      await this.connectionsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsGetById.token)
  public async getById(
    options: EventDidcommConnectionsGetByIdInput,
  ): Promise<EventDidcommConnectionsGetById> {
    return new EventDidcommConnectionsGetById(
      await this.connectionsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsCreateWithSelf.token)
  public async createConnectionWithSelf(
    options: EventDidcommConnectionsCreateWithSelfInput,
  ): Promise<EventDidcommConnectionsCreateWithSelf> {
    return new EventDidcommConnectionsCreateWithSelf(
      await this.connectionsService.createConnectionWithSelf(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsBlock.token)
  public async blockConnection(
    options: EventDidcommConnectionsBlockInput,
  ): Promise<EventDidcommConnectionsBlock> {
    return new EventDidcommConnectionsBlock(
      await this.connectionsService.blockByIdOrDid(options),
      options.tenantId,
    );
  }
}
