import type { AppConfig } from '../config.js';

import { AutoAcceptCredential, utils } from '@aries-framework/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validationSchema } from '../validation.js';

const mockConfig = (port: number = 3001, withLedger = false): AppConfig => ({
  agentHost: '',
  port: 3000,
  jwtSecret: '',
  nats: {
    url: 'localhost',
  },
  agent: {
    name: 'my-test-agent',
    walletId: utils.uuid(),
    walletKey: 'some-key',
    ledgerIds: withLedger ? ['BCOVRIN_TEST'] : [],
    host: 'http://localhost',
    inboundPort: port,
    path: '',
    publicDidSeed: withLedger ? '12312367897123300000000000000000' : '',
    autoAcceptConnection: true,
    autoAcceptCredential: AutoAcceptCredential.ContentApproved,
  },
});

export const mockConfigModule = (port: number = 3000, withLedger = false) =>
  ConfigModule.forRoot({
    load: [() => mockConfig(port, withLedger)],
    validationSchema,
  });

describe('configuration', () => {
  const mockedConfig = mockConfig();

  describe('service', () => {
    it('should be able to instantiate a config service', () => {
      const configuration = new ConfigService(mockConfig());
      expect(configuration).toBeInstanceOf(ConfigService);
    });

    it('should be able to extract root value', () => {
      const configuration = new ConfigService(mockConfig());

      expect(configuration.get('port')).toStrictEqual(mockedConfig.port);
    });

    it('should be able to extract root value as object', () => {
      const configuration = new ConfigService(mockConfig());

      expect(configuration.get('agent')).toHaveProperty('name');
    });

    it('should be able to extract nested values', () => {
      const configuration = new ConfigService(mockConfig());

      expect(configuration.get('agent.autoAcceptCredential')).toStrictEqual(
        mockedConfig.agent.autoAcceptCredential,
      );
    });
  });
});
