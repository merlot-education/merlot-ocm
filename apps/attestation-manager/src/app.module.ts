import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

import ExceptionHandler from './common/exception.handler.js';
import config from './config/config.js';
import validationSchema from './config/validation.js';
import CredentialDefModule from './credentialDef/module.js';
import HealthController from './health/health.controller.js';
import AttestationModule from './issue-credential/module.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';
import SchemasModule from './schemas/module.js';
import UserInfoModule from './userInfo/module.js';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    SchemasModule,
    AttestationModule,
    CredentialDefModule,
    UserInfoModule,
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
  public configure(consumer: MiddlewareConsumer) {
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
