import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { config } from './config/config.js';
import { validationSchema } from './config/validation.js';
import { HealthController } from './health/health.controller.js';
import { ExceptionHandler } from './globalUtils/exception.handler.js';
import { AgentModule } from './agent/agent.module.js';
import { ConnectionModule } from './agent/connection/connection.module.js';

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
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: ExceptionHandler,
  //   },
  // ],
})
export class AppModule {}
