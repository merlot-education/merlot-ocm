import config from '@config/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientService } from '@src/client/nats.client';
import { NATSServices } from '@src/common/constants';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

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
