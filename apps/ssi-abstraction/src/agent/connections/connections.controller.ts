import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsBlock,
} from '@ocm/shared';

import { ConnectionsService } from './connections.service.js';

@Controller('connections')
export class ConnectionsController {
  public constructor(private connectionsService: ConnectionsService) {}

  @MessagePattern(EventDidcommConnectionsGetAll.token)
  public async getAll(): Promise<EventDidcommConnectionsGetAll> {
    return new EventDidcommConnectionsGetAll(
      await this.connectionsService.getAll(),
    );
  }

  @MessagePattern(EventDidcommConnectionsGetById.token)
  public async getById({
    id,
  }: {
    id: string;
  }): Promise<EventDidcommConnectionsGetById> {
    return new EventDidcommConnectionsGetById(
      await this.connectionsService.getById(id),
    );
  }

  @MessagePattern(EventDidcommConnectionsCreateWithSelf.token)
  public async createConnectionWithSelf(): Promise<EventDidcommConnectionsCreateWithSelf> {
    return new EventDidcommConnectionsCreateWithSelf(
      await this.connectionsService.createConnectionWithSelf(),
    );
  }

  @MessagePattern(EventDidcommConnectionsBlock.token)
  public async blockConnection({
    idOrDid,
  }: {
    idOrDid: string;
  }): Promise<EventDidcommConnectionsBlock> {
    return new EventDidcommConnectionsBlock(
      await this.connectionsService.blockByIdOrDid(idOrDid),
    );
  }
}
