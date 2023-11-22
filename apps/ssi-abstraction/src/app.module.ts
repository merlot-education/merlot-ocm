import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { AgentModule } from './agent/agent.module.js';
import { ConnectionModule } from './agent/connection/connection.module.js';
import { config } from './config/config.js';
import { validationSchema } from './config/validation.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    AgentModule,
    ConnectionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
