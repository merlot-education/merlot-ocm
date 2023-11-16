import { APP_FILTER } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import config from './config/config.js';
import validationSchema from './config/validation.js';
import HealthController from './health/health.controller.js';
import ExceptionHandler from './globalUtils/exception.handler.js';
import { AgentMid } from './middleware/agentMid.middleware.js';
import { AgentModule } from './agent/agent.module.js';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    AgentModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AgentMid).forRoutes('agent', '*/agent');
  }
}

export default AppModule;
