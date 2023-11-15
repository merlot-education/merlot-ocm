import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { startServer } from '@aries-framework/rest';
import AppModule from '@src/app.module';
import { AGENT } from '@agent/module';
import logger from './globalUtils/logger';
import swaggerSetup from './globalUtils/swagger';
import appConf from './globalUtils/appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const agent = await app.resolve(AGENT);
  const configService = app.get(ConfigService);

  appConf(app, configService);

  swaggerSetup(app);

  await app.startAllMicroservices();

  const afjPort = configService.get('afjExtPort') || 3001;
  const servicePort = configService.get('PORT') || 3000;

  const afjExtConfig = {
    port: afjPort,
  };

  await startServer(agent, afjExtConfig);

  logger.info(`Listening AFJ ext on Port: ${afjPort}`);

  await app.listen(servicePort, () => {
    logger.info(`Listening on Port: ${servicePort}`);
  });
}
bootstrap();
