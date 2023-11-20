import { Module } from '@nestjs/common';
import { AgentModule } from '../agent.module.js';
import { ConnectionController } from './connection.controller.js';
import { ConnectionService } from './connection.service.js';

@Module({
  imports: [AgentModule],
  providers: [ConnectionService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
