import type { ConfigType } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_CLIENT } from './common/constants.js';
import { httpConfig } from './config/http.config.js';
import { natsConfig } from './config/nats.config.js';
import { ssiConfig } from './config/ssi.config.js';
import { validationSchema } from './config/validation.js';
import { HealthModule } from './health/health.module.js';
import { SchemasModule } from './schemas/schemas.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, natsConfig, ssiConfig],
      cache: true,
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: NATS_CLIENT,
          inject: [natsConfig.KEY],
          useFactory: (config: ConfigType<typeof natsConfig>) => ({
            transport: Transport.NATS,
            options: {
              url: config.url as string,
            },
          }),
        },
      ],
    }),

    HealthModule,
    SchemasModule,
  ],
})
export class Application {}
