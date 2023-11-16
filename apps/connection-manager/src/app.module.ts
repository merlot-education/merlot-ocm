import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import ExceptionHandler from './common/exception.handler.js';
import config from './config/config.js';
import validationSchema from './config/validation.js';
import ConnectionsModule from './connections/module.js';
import SchedulerService from './connections/scheduler/scheduler.service.js';
import HealthController from './health/health.controller.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';
import PrismaModule from './prisma/prisma.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    PrismaModule,
    ConnectionsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    SchedulerService,
  ],
})
export default class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    // eslint-disable-line
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'v1/health',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
