import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import AppModule from './app.module.js';
import logger from './globalUtils/logger.js';
import swaggerSetup from './globalUtils/swagger.js';
import appConf from './globalUtils/appConfig.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await appConf(app, configService);

  swaggerSetup(app);

  await app.startAllMicroservices();

  const servicePort = configService.get<number>('port') || 3000;

  await app.listen(servicePort, () => {
    logger.info(`Listening on Port: ${servicePort}`);
  });
}
bootstrap();
