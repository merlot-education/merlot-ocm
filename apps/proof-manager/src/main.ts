import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import AppModule from './app.module.js';
import AllExceptionsFilter from './utils/exceptionsFilter.js';
import logger from './utils/logger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.get('nats')?.url],
    },
  });

  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gaia-x Proof Manager API')
    .setDescription('API documentation for GAIA-X Proof Manager')
    .setVersion('1.0')
    .addServer(`localhost:${configService.get('PORT')}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/swagger', app, document);
  await app.startAllMicroservices();

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(configService.get('PORT') || 3000, () => {
    logger.info(`Listening on Port:${configService.get('PORT')}` || 3000);
  });
}
bootstrap();
