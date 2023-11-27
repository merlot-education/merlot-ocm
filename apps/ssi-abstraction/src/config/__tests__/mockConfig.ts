import type { AppConfig } from '../config.js';

import { AutoAcceptCredential } from '@aries-framework/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validationSchema } from '../validation.js';

const mockConfig: AppConfig = {
  agentHost: '',
  port: 3000,
  jwtSecret: '',
  nats: {
    url: 'localhost',
  },
  agent: {
    name: 'my-test-agent',
    walletId: 'some-id',
    walletKey: 'some-key',
    ledgerIds: ['BCOVRIN_TEST'],
    host: '3000',
    peerPort: '3001',
    path: '',
    publicDidSeed: 'none',
    autoAcceptConnection: false,
    autoAcceptCredential: AutoAcceptCredential.ContentApproved,
  },
};

export const mockConfigModule = ConfigModule.forRoot({
  load: [() => mockConfig],
  validationSchema,
});

describe('configuration', () => {
  describe('service', () => {
    it('should be able to instantiate a config service', () => {
      const configuration = new ConfigService(mockConfig);
      expect(configuration).toBeInstanceOf(ConfigService);
    });

    it('should be able to extract root value', () => {
      const configuration = new ConfigService(mockConfig);

      expect(configuration.get('port')).toStrictEqual(mockConfig.port);
    });

    it('should be able to extract root value as object', () => {
      const configuration = new ConfigService(mockConfig);

      expect(configuration.get('agent')).toMatchObject(mockConfig.agent);
    });

    it('should be able to extract nested values', () => {
      const configuration = new ConfigService(mockConfig);

      expect(configuration.get('agent.autoAcceptCredential')).toStrictEqual(
        mockConfig.agent.autoAcceptCredential,
      );
    });
  });
});
