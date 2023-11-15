import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import NatsClientService from '../client/nats.client.js';
import { NATSServices } from '../common/constants.js';
import config from '../config/config.js';
import PrismaService from '../prisma/prisma.service.js';
import PrincipalController from './controller/controller.js';
import PrincipalService from './services/service.js';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: NATSServices.SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: [config().nats.url as string],
        },
      },
    ]),
  ],
  controllers: [PrincipalController],
  providers: [PrincipalService, PrismaService, NatsClientService],
})
export default class PrincipalModule {}
