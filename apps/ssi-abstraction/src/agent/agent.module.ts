import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from '../config/config.js';
import { NatsClientService } from '../client/nats.client.js';
import { NATSServices } from '../common/constants.js';
import { AgentController } from './agent.controller.js';
import { AgentService } from './agent.service.js';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: NATSServices.SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: [config().nats.url],
        },
      },
    ]),
  ],
  providers: [NatsClientService, AgentService],
  controllers: [AgentController],
})
export class AgentModule {}

export default AgentModule;
