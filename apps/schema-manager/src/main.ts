/* c8 ignore start */
import type { MicroserviceOptions } from '@nestjs/microservices';

import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Application } from './application.js';

const app = await NestFactory.create(Application);
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

await app.listen(configService.get('PORT') || 3000);
/* c8 ignore stop */
