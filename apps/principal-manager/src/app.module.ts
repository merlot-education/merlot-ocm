import { HttpModule } from '@nestjs/axios';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import ExceptionHandler from './common/exception.handler.js';
import config from './config/config.js';
import validationSchema from './config/validation.js';
import HealthController from './health/health.controller.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';
import PrincipalModule from './principal/module.js';
import PrismaService from './prisma/prisma.service.js';
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
    PrincipalModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export default class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'v1/health',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
