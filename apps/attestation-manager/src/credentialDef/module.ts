import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import NatsClientService from '../client/nats.client.js';
import RestClientService from '../client/rest.client.js';
import { NATSServices } from '../common/constants.js';
import config from '../config/config.js';
import PrismaService from '../prisma/prisma.service.js';
import SchemasService from '../schemas/services/service.js';
import CredentialDefController from './controller/controller.js';
import CredentialDefService from './services/service.js';

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
  controllers: [CredentialDefController],
  providers: [
    CredentialDefService,
    PrismaService,
    NatsClientService,
    RestClientService,
    SchemasService,
  ],
})
export default class CredentialDefModule {}
