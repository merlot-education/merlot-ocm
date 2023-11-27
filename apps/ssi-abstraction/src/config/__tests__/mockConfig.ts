import type { AppConfig } from '../config.js';

import { AutoAcceptCredential } from '@aries-framework/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validationSchema } from '../validation.js';

const mockConfig = (port: number = 3001): AppConfig => ({
  agentHost: '',
  port:3000,
  jwtSecret: '',
  nats: {
    url: 'localhost',
  },
  agent: {
    name: 'my-test-agent',
    walletId: 'some-id',
    walletKey: 'some-key',
    ledgerIds: [],
    host: '3000',
    inboundPort: port,
    path: '',
    publicDidSeed: '',
    autoAcceptConnection: false,
    autoAcceptCredential: AutoAcceptCredential.ContentApproved,
  },
});

export const mockConfigModule = (port: number = 3000) =>
  ConfigModule.forRoot({
    load: [() => mockConfig(port)],
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

      expect(configuration.get('agent')).toMatchObject(mockedConfig.agent);
    });

    it('should be able to extract nested values', () => {
      const configuration = new ConfigService(mockConfig());

      expect(configuration.get('agent.autoAcceptCredential')).toStrictEqual(
        mockedConfig.agent.autoAcceptCredential,
      );
    });
  });
});
