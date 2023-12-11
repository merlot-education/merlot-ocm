import {
  CredentialExchangeRecord,
  CredentialState,
} from '@aries-framework/core';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { AnonCredsCredentialsController } from '../anoncredsCredentials.controller.js';
import { AnonCredsCredentialsService } from '../anoncredsCredentials.service.js';

describe('AnonCredsCredentialsController', () => {
  let credentialsController: AnonCredsCredentialsController;
  let credentialsService: AnonCredsCredentialsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [AnonCredsCredentialsController],
      providers: [AnonCredsCredentialsService],
    }).compile();

    credentialsService = moduleRef.get(AnonCredsCredentialsService);
    credentialsController = moduleRef.get(AnonCredsCredentialsController);
  });

  describe('get all', () => {
    it('should get all the credential records of the agent', async () => {
      const result: Array<CredentialExchangeRecord> = [];
      jest.spyOn(credentialsService, 'getAll').mockResolvedValue(result);

      const event = await credentialsController.getAll({
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('get by id', () => {
    it('should get a credential record by id', async () => {
      const result: CredentialExchangeRecord | null = null;
      jest.spyOn(credentialsService, 'getById').mockResolvedValue(result);

      const event = await credentialsController.getById({
        tenantId: 'some-id',
        credentialRecordId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('offer', () => {
    it('should offer a credential', async () => {
      const result: CredentialExchangeRecord = new CredentialExchangeRecord({
        state: CredentialState.Done,
        threadId: 'some-id',
        protocolVersion: 'v2',
      });
      jest.spyOn(credentialsService, 'offer').mockResolvedValue(result);

      const event = await credentialsController.offer({
        tenantId: 'some-id',
        connectionId: 'some-id',
        credentialDefinitionId: 'some-id',
        attributes: [
          { name: 'Name', value: 'Berend', mimeType: 'application/text' },
          { name: 'Age', value: '25' },
        ],
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('offer to self', () => {
    it('should offer a credential to self', async () => {
      const result: CredentialExchangeRecord = new CredentialExchangeRecord({
        state: CredentialState.Done,
        threadId: 'some-id',
        protocolVersion: 'v2',
      });
      jest.spyOn(credentialsService, 'offerToSelf').mockResolvedValue(result);

      const event = await credentialsController.offerToSelf({
        tenantId: 'some-id',
        credentialDefinitionId: 'some-id',
        attributes: [
          { name: 'Name', value: 'Berend', mimeType: 'application/text' },
          { name: 'Age', value: '25' },
        ],
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
