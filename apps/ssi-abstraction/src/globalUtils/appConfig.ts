import { VersioningType, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import logger from './logger.js';

/**
 * Microservice and versioning configuration of the service
 *
 * @param app - Nest.js internal configuration object
 * @param configService - Nest.js internal configuration object
 */
export default async function appConf(
  app: INestApplication,
  configService: ConfigService,
): Promise<void> {
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [configService.get('nats')?.url],
      },
    });
  } catch (err) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('Trying again to connect to nats.');
      }, 2000);
    });
    logger.error(err);
    logger.info('Retrying connection to NATS.');
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [configService.get('nats')?.url],
      },
    });
  }

  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });
}
