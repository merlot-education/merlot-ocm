import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { httpConfig } from './config/http.config.js';
import { natsConfig } from './config/nats.config.js';
import { ssiConfig } from './config/ssi.config.js';
import { validationSchema } from './config/validation.js';
import { HealthModule } from './health/health.module.js';

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
    HealthModule,
  ],
})
export default class AppModule {}
