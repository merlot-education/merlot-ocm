import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import NatsClientService from '../client/nats.client.js';
import RestClientService from '../client/rest.client.js';
import TSAClientService from '../client/tsa.client.js';
import { NATSServices } from '../common/constants.js';
import config from '../config/config.js';
import CredentialDefService from '../credentialDef/services/service.js';
import PrismaService from '../prisma/prisma.service.js';
import SchemasService from '../schemas/services/service.js';
import UserInfoService from '../userInfo/services/service.js';

import AttestationController from './controller/controller.js';
import AttestationService from './services/service.js';

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
  controllers: [AttestationController],
  providers: [
    AttestationService,
    PrismaService,
    NatsClientService,
    RestClientService,
    CredentialDefService,
    SchemasService,
    TSAClientService,
    UserInfoService,
  ],
})
export default class AttestationModule {}
