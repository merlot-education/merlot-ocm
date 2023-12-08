import type { ConfigType } from '@nestjs/config';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';

import { SERVICE_NAME } from '../common/constants.js';
import { natsConfig } from '../config/nats.config.js';

import { HealthController } from './health.controller.js';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: SERVICE_NAME,
          inject: [natsConfig.KEY],
          useFactory: (config: ConfigType<typeof natsConfig>) => ({
            transport: Transport.NATS,
            options: {
              servers: [config.url as string],
            },
          }),
        },
      ],
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
