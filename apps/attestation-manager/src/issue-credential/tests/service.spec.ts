import type { ResponseType } from '../../common/response.js';
import type { TestingModule } from '@nestjs/testing';
import type { Credential, CredentialsType } from '@prisma/client';

import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import NatsClientServiceMock from '../../client/tests/__mocks__/nats.client.js';
import RestClientServiceMock from '../../client/tests/__mocks__/rest.client.js';
import TSAClientServiceMock from '../../client/tests/__mocks__/tsa.client.js';
import { natsConnectionResponse } from '../../client/tests/stubs/nats-response.js';
import TSAClientService from '../../client/tsa.client.js';
import CredentialDefService from '../../credentialDef/services/service.js';
import CredentialDefServiceMock from '../../credentialDef/tests/__mocks__/service.js';
import PrismaService from '../../prisma/prisma.service.js';
import PrismaServiceMock from '../../prisma/tests/__mocks__/prisma.service.js';
import AttestationService from '../services/service.js';

import credentialDto from './stubs/credential-dto.js';
import credentialsTypeDto from './stubs/credential-type-dto.js';

describe('AttestationService', () => {
  let attestationService: AttestationService;
  let spyGetConnectionByID: jest.SpyInstance;

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

  const TSAClientServiceProvider = {
    provide: TSAClientService,
    useFactory: TSAClientServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AttestationService,
        CredentialDefServiceProvider,
        PrismaServiceProvider,
        RestClientServiceProvider,
        NatsClientServiceProvider,
        TSAClientServiceProvider,
        ConfigService,
      ],
    }).compile();

    attestationService = module.get<AttestationService>(AttestationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(attestationService).toBeDefined();
  });

  // describe('createOfferCredential()', () => {
  //   let attestationResponse: ResponseType;

  //   beforeEach(async () => {
  //     jest
  //       .spyOn(attestationService, 'getSchemaAndAttributesBySchemaIDFromLedger')
  //       .mockImplementation(
  //         AttestationServiceMock().getSchemaAndAttributesBySchemaIDFromLedger,
  //       );

  //     attestationResponse = await attestationService.createOfferCredential(
  //       offerCredentialDto(),
  //     );
  //   });

  //   it('should call post() from restClient', async () => {
  //     expect(RestClientServiceMock().post).toHaveBeenCalled();
  //   });

  //   it('should get a response from AFJ', async () => {
  //     expect(attestationResponse).not.toBe(null);
  //   });
  // });

  describe('acceptRequestCredential()', () => {
    let attestationResponse: ResponseType;

    beforeEach(async () => {
      attestationResponse = await attestationService.acceptRequestCredential(
        credentialDto().credentialId,
      );
    });

    it('should call post() from restClient', async () => {
      expect(RestClientServiceMock().post).toHaveBeenCalled();
    });

    it('should get a response from AFJ', async () => {
      expect(attestationResponse).not.toBe(null);
    });
  });

  describe('createCredential()', () => {
    beforeEach(async () => {
      spyGetConnectionByID = jest.spyOn(
        attestationService,
        'getConnectionByID',
      );

      await attestationService.createCredential(credentialDto());
    });

    it('should call getConnectionByID()', async () => {
      expect(spyGetConnectionByID).toHaveBeenCalled();
    });

    it('should call create() from PrismaService.credential', async () => {
      expect(PrismaServiceMock().credential.create).toHaveBeenCalled();
    });
  });

  describe('getConnectionByID()', () => {
    let attestationResponse: ResponseType;

    beforeEach(async () => {
      attestationResponse = await attestationService.getConnectionByID(
        credentialDto().connectionId,
      );
    });

    it('should call getConnectionById() from NatsClientService', async () => {
      expect(NatsClientServiceMock().getConnectionById).toHaveBeenCalled();
    });

    it('should receive connection details from NatsClientService', async () => {
      expect(attestationResponse).toEqual(natsConnectionResponse);
    });
  });

  describe('updateCredential()', () => {
    let attestationResponse: Credential;

    beforeEach(async () => {
      attestationResponse =
        await attestationService.updateCredential(credentialDto());
    });

    it('should call update() from PrismaService.credential', async () => {
      expect(PrismaServiceMock().credential.update).toHaveBeenCalled();
    });

    it('should retreive updated credential', async () => {
      expect(attestationResponse).toEqual(credentialDto());
    });
  });

  describe('findCredentialById()', () => {
    let attestationResponse: Credential | null;
    let id: string;

    beforeEach(async () => {
      id = credentialDto().credDefId;

      attestationResponse = await attestationService.findCredentialById(id);
    });

    it('should call findUnique() from PrismaService.credential', async () => {
      expect(PrismaServiceMock().credential.findUnique).toHaveBeenCalled();
    });

    it('should retrieve schema by ID', async () => {
      expect(attestationResponse).toEqual(credentialDto());
    });
  });

  describe('findCredential()', () => {
    let attestationResponse: Array<number | Credential[]>;

    beforeEach(async () => {
      attestationResponse = await attestationService.findCredential(
        10,
        10,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      );
    });

    it('should call findMany() from PrismaService.credential', async () => {
      expect(PrismaServiceMock().credential.findMany).toHaveBeenCalled();
    });

    it('should call count() from PrismaService.credential', async () => {
      expect(PrismaServiceMock().credential.count).toHaveBeenCalled();
    });

    it('should call $transaction() from PrismaService', async () => {
      expect(PrismaServiceMock().$transaction).toHaveBeenCalled();
    });

    it('should retrieve schema by ID', async () => {
      expect(attestationResponse).toEqual([1, [credentialDto()]]);
    });
  });

  // describe('issueMemberCredentials()', () => {
  //   let attestationResponse: any;

  //   beforeEach(async () => {
  //     spyCreateOfferCredential = jest.spyOn(
  //       attestationService,
  //       'createOfferCredential',
  //     );

  //     attestationResponse = await attestationService.issueMemberCredentials({
  //       status: credentialDto().state,
  //       connectionId: credentialDto().connectionId,
  //       theirLabel: credentialDto().principalDid || '',
  //       participantDID,
  //       credDefId: credentialDto().credDefId,
  //       theirDid: credentialDto().principalDid || '',
  //       attributes: [
  //         { name: 'foo', value: 'bar' },
  //         { name: 'foo', value: 'bar' },
  //         { name: 'foo', value: 'bar' },
  //       ],
  //       autoAcceptCredential: 'never',
  //     });
  //   });

  //   it('should call createOfferCredential()', async () => {
  //     expect(spyCreateOfferCredential).toHaveBeenCalled();
  //   });

  //   it('should get a response from AFJ', async () => {
  //     expect(attestationResponse).not.toBe(null);
  //   });
  // });

  describe('getPrincipalMemberShipCredentials()', () => {
    let attestationResponse: CredentialsType | null;
    let data: {
      type: string;
    };

    beforeEach(async () => {
      data = { type: credentialsTypeDto().type };
      attestationResponse =
        await attestationService.getPrincipalMemberShipCredentials(data);
    });

    it('should call findUnique() from PrismaService.credentialsType', async () => {
      expect(PrismaServiceMock().credentialsType.findFirst).toHaveBeenCalled();
    });

    it('should get principal member credentials type', async () => {
      expect(attestationResponse).toEqual(credentialsTypeDto());
    });
  });

  describe('createCredentialsType()', () => {
    let attestationResponse: CredentialsType;

    beforeEach(async () => {
      attestationResponse =
        await attestationService.createCredentialsType(credentialsTypeDto());
    });

    it('should call create() from PrismaService.credentialsType', async () => {
      expect(PrismaServiceMock().credentialsType.create).toHaveBeenCalled();
    });

    it('should retrieve created credetialType', async () => {
      expect(attestationResponse).toEqual(credentialsTypeDto());
    });
  });
});
