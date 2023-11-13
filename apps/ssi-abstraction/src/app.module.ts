import { APP_FILTER } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import config from '@config/config';
import validationSchema from '@config/validation';
import HealthController from '@src/health/health.controller';
import ExceptionHandler from '@src/globalUtils/exception.handler';
import DidCommModule from '@didComm/module';
import { AgentMid } from './middleware/agentMid.middleware';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    DidCommModule,
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
