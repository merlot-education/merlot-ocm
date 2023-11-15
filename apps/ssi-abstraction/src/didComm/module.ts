import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import DidCommController from '@didComm/controller/controller';
import AgentModule from '@agent/module';
import { NATSServices } from '@common/constants';
import config from '@config/config';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: NATSServices.SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: [config().nats.url],
        },
      },
    ]),
    AgentModule,
  ],
  controllers: [DidCommController],
  providers: [],
})
export default class DidCommModule {}
