import type { MicroserviceOptions } from '@nestjs/microservices';

import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import AppModule from './app.module.js';
// import AllExceptionsFilter from './utils/exceptionsFilter.js';
// import logger from './utils/logger.js';

const app = await NestFactory.create(AppModule);
const configService = app.get(ConfigService);
app.enableCors();

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.NATS,
  options: {
    servers: [configService.get('nats').url],
  },
});

app.enableVersioning({
  defaultVersion: ['1'],
  type: VersioningType.URI,
});

const swaggerConfig = new DocumentBuilder()
  .setTitle('Gaia-X OCM Credential Manager API')
  .setDescription('API documentation for Gaia-X OCM Credential Manager')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);

SwaggerModule.setup('/swagger', app, document);
await app.startAllMicroservices();

// const httpAdapter = app.get(HttpAdapterHost);
// app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

await app.listen(configService.get('PORT') || 3000, () => {
  // logger.info(`Listening on Port:${configService.get('PORT')}` || 3000);
});
