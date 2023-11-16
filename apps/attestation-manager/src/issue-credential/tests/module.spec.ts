import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import NatsClientServiceMock from '../../client/tests/__mocks__/nats.client.js';
import RestClientServiceMock from '../../client/tests/__mocks__/rest.client.js';
import CredentialDefService from '../../credentialDef/services/service.js';
import CredentialDefServiceMock from '../../credentialDef/tests/__mocks__/service.js';
import PrismaService from '../../prisma/prisma.service.js';
import PrismaServiceMock from '../../prisma/tests/__mocks__/prisma.service.js';
import AttestationModule from '../module.js';
import AttestationService from '../services/service.js';
import AttestationServiceMock from './__mocks__/service.js';

describe('AttestationModule', () => {
  let attestationModule: AttestationModule;

  const AttestationServiceProvider = {
    provide: AttestationService,
    useFactory: AttestationServiceMock,
  };

  const CredentialDefServiceProvider = {
    provide: CredentialDefService,
    useFactory: CredentialDefServiceMock,
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
        AttestationModule,
        AttestationServiceProvider,
        CredentialDefServiceProvider,
        PrismaServiceProvider,
        NatsClientServiceProvider,
        RestClientServiceProvider,
      ],
    }).compile();

    attestationModule = module.get<AttestationModule>(AttestationModule);
  });

  it('should be defined', () => {
    expect(attestationModule).toBeDefined();
  });
});
