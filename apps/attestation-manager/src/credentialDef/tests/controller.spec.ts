import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import httpMocks from 'node-mocks-http';
import CredentialDefController from '../controller/controller.js';
import CredentialDefService from '../services/service.js';
import CredentialDefServiceMock from './__mocks__/service.js';
import credDefStub from './stubs/credDef.stub.js';

describe('CredentialDefController', () => {
  let credentialDefController: CredentialDefController;
  let spyService: CredentialDefService;

  beforeEach(async () => {
    const CredentialDefServiceProvider = {
      provide: CredentialDefService,
      useFactory: CredentialDefServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CredentialDefController],
      providers: [CredentialDefServiceProvider, ConfigService],
    }).compile();

    credentialDefController = module.get<CredentialDefController>(
      CredentialDefController,
    );
    spyService = module.get<CredentialDefService>(CredentialDefService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(credentialDefController).toBeDefined();
  });

  describe('findCredentialDef()', () => {
    let query: {
      pageSize: string;
      page: string;
      schemaID: string;
    };
    let credDefResponse: Response<string, Record<string, any>>;

    beforeEach(async () => {
      query = {
        pageSize: '10',
        page: '1',
        schemaID: credDefStub().schemaID,
      };

      const response = httpMocks.createResponse();
      credDefResponse = await credentialDefController.findCredentialDef(
        query,
        response,
      );
    });

    it('should call findCredentialDef() from service', async () => {
      expect(spyService.findCredentialDef).toHaveBeenCalled();
    });

    it('should retrieve CredDef for a correct ID', async () => {
      expect(
        spyService.findCredentialDef(
          query.pageSize ? parseInt(query.pageSize, 10) : 10,
          query.page ? parseInt(query.page, 10) : 0,
          query.schemaID ? query.schemaID : '',
        ),
      ).toEqual([1, [credDefStub()]]);
    });

    it(`should retrieve HTTP status success(${HttpStatus.OK})`, async () => {
      expect(credDefResponse?.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('findCredentialDefById()', () => {
    let credDefID: string;
    let credDef: Response<string, Record<string, any>>;

    beforeEach(async () => {
      credDefID = credDefStub().id;

      const response = httpMocks.createResponse();
      credDef = await credentialDefController.findCredentialDefById(
        credDefID,
        response,
      );
    });

    it('should call findCredentialDefById() for a CredDef', async () => {
      expect(spyService.findCredentialDefById).toHaveBeenCalled();
    });

    it('should retrieve CredDef for a correct ID', async () => {
      expect(spyService.findCredentialDefById(credDefID)).toEqual([
        1,
        [credDefStub()],
      ]);
    });

    it(`should retrieve HTTP status success(${HttpStatus.OK})`, async () => {
      expect(credDef?.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('createCredDef()', () => {
    let credDef: Response<string, Record<string, any>>;

    beforeEach(async () => {
      const response = httpMocks.createResponse();
      credDef = await credentialDefController.createCredentialDef(
        credDefStub(),
        response,
      );
    });

    it('should call checkCredDefByNameAndSchemaID() from service', async () => {
      expect(spyService.checkCredDefByNameAndSchemaID).toHaveBeenCalled();
    });

    it('should not retrieve CredDef for a given credDef', async () => {
      expect(spyService.checkCredDefByNameAndSchemaID(credDefStub())).toContain(
        0,
      );
    });

    it('should call createCredDefOnLedger() from service', async () => {
      expect(spyService.createCredDefOnLedger).toHaveBeenCalled();
    });

    it(`should retrieve HTTP status created(${HttpStatus.CREATED})`, async () => {
      expect(credDef?.statusCode).toEqual(HttpStatus.CREATED);
    });
  });
});
