import type { TestingModule } from '@nestjs/testing';
import type { CredentialDef } from '@prisma/client';

import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import NatsClientServiceMock from '../../client/tests/__mocks__/nats.client.js';
import RestClientServiceMock from '../../client/tests/__mocks__/rest.client.js';
import PrismaService from '../../prisma/prisma.service.js';
import PrismaServiceMock from '../../prisma/tests/__mocks__/prisma.service.js';
import SchemasService from '../../schemas/services/service.js';
import SchemasServiceMock from '../../schemas/tests/__mocks__/service.js';
import CredentialDefService from '../services/service.js';

import credDefStub from './stubs/credDef.stub.js';

describe('CredentialDefService', () => {
  let credDefService: CredentialDefService;

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

  const SchemasServiceProvider = {
    provide: SchemasService,
    useFactory: SchemasServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CredentialDefService,
        PrismaServiceProvider,
        NatsClientServiceProvider,
        RestClientServiceProvider,
        ConfigService,
        SchemasServiceProvider,
      ],
    }).compile();

    credDefService = module.get<CredentialDefService>(CredentialDefService);
  });

  it('should be defined', () => {
    expect(credDefService).toBeDefined();
  });

  describe('createCredDef()', () => {
    let credDefResponse: CredentialDef;

    beforeEach(async () => {
      credDefResponse = await credDefService.createCredDef(credDefStub());
    });

    it('should call create() from PrismaService', async () => {
      expect(PrismaServiceMock().credentialDef.create).toHaveBeenCalled();
    });

    it('should retrieve credDef by participantId', async () => {
      expect(credDefResponse).toEqual([credDefStub()]);
    });
  });

  describe('findCredentialDef()', () => {
    let credDefResponse: Array<number | CredentialDef[]>;
    let id: string;

    beforeEach(async () => {
      const pageSize = 10;
      const page = 10;
      id = credDefStub().credDefId;

      credDefResponse = await credDefService.findCredentialDef(
        pageSize,
        page,
        id,
      );
    });

    it('should call findMany() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.findMany).toHaveBeenCalled();
    });

    it('should call count() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.count).toHaveBeenCalled();
    });

    it('should call $transaction() from PrismaService', async () => {
      expect(PrismaServiceMock().$transaction).toHaveBeenCalled();
    });

    it('should retrieve schema by ID', async () => {
      expect(credDefResponse).toEqual([1, [credDefStub()]]);
    });
  });

  describe('findCredentialDefById()', () => {
    let credDefResponse: Array<number | CredentialDef[]>;
    let id: string;

    beforeEach(async () => {
      id = credDefStub().credDefId;

      credDefResponse = await credDefService.findCredentialDefById(id);
    });

    it('should call findMany() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.findMany).toHaveBeenCalled();
    });

    it('should call count() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.count).toHaveBeenCalled();
    });

    it('should call $transaction() from PrismaService', async () => {
      expect(PrismaServiceMock().$transaction).toHaveBeenCalled();
    });

    it('should retrieve schema by ID', async () => {
      expect(credDefResponse).toEqual([1, [credDefStub()]]);
    });
  });

  describe('checkCredDefByNameAndSchemaID()', () => {
    let credDefResponse: Array<number | CredentialDef[]>;

    beforeEach(async () => {
      credDefResponse =
        await credDefService.checkCredDefByNameAndSchemaID(credDefStub());
    });

    it('should call findMany() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.findMany).toHaveBeenCalled();
    });

    it('should call count() from PrismaService.credentialDef', async () => {
      expect(PrismaServiceMock().credentialDef.count).toHaveBeenCalled();
    });

    it('should call $transaction() from PrismaService', async () => {
      expect(PrismaServiceMock().$transaction).toHaveBeenCalled();
    });

    it('should retrieve credDef by Name and Schema ID', async () => {
      expect(credDefResponse).toEqual([1, [credDefStub()]]);
    });
  });

  describe('createCredDefOnLedger()', () => {
    let credDefResponse: Array<number | CredentialDef[]>;

    beforeEach(async () => {
      credDefResponse = await credDefService.createCredDefOnLedger({
        schemaId: credDefStub().schemaID,
        supportRevocation: credDefStub().supportRevocation,
        tag: credDefStub().tag,
      });
    });

    it('should call post() from restClient', async () => {
      expect(RestClientServiceMock().post).toHaveBeenCalled();
    });

    it('should get a response from AFJ', async () => {
      expect(credDefResponse).not.toBe(null);
    });
  });
});
