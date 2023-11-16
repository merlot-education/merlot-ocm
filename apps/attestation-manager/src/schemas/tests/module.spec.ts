import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import NatsClientServiceMock from '../../client/tests/__mocks__/nats.client.js';
import RestClientServiceMock from '../../client/tests/__mocks__/rest.client.js';
import PrismaService from '../../prisma/prisma.service.js';
import PrismaServiceMock from '../../prisma/tests/__mocks__/prisma.service.js';
import SchemasModule from '../module.js';
import SchemasService from '../services/service.js';
import SchemasServiceMock from './__mocks__/service.js';

describe('SchemasModule', () => {
  let schemasModule: SchemasModule;

  const SchemasServiceProvider = {
    provide: SchemasService,
    useFactory: SchemasServiceMock,
  };

  const PrismaServiceProvider = {
    provide: PrismaService,
    useFactory: PrismaServiceMock,
  };

  const NatsClientServiceProvider = {
    provide: NatsClientService,
    useFactory: NatsClientServiceMock,
  };

  const RestClientServiceProvider = {
    provide: RestClientService,
    useFactory: RestClientServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SchemasModule,
        SchemasServiceProvider,
        PrismaServiceProvider,
        NatsClientServiceProvider,
        RestClientServiceProvider,
        ConfigService,
      ],
    }).compile();

    schemasModule = module.get<SchemasModule>(SchemasModule);
  });

  it('should be defined', () => {
    expect(schemasModule).toBeDefined();
  });
});
