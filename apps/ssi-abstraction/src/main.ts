import type { MicroserviceOptions} from '@nestjs/microservices';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module.js';
import { config } from './config/config.js';

const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.NATS,
    options: {
      servers: [config().nats.url],
    },
  },
);

await app.listen();
