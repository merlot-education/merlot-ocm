import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ConnectionService } from './connection.service.js';

@Controller('connection')
export class ConnectionController {
  public constructor(private connectionService: ConnectionService) {}

  @MessagePattern('connection.getAll')
  public async getAll() {
    return this.connectionService.getAll();
  }
}
