import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type { EventInfoPublicDid } from '@ocm/shared';

import { DidDocument } from '@aries-framework/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { firstValueFrom, type Observable } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { AgentService } from '../src/agent/agent.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

const mockDidDocument = {
  '@context': ['https://w3id.org/did/v1'],
  id: 'did:indy:bcovrin:test:7KuDTpQh3GJ7Gp6kErpWvM',
  verificationMethod: [
    {
      id: 'did:indy:bcovrin:test:7KuDTpQh3GJ7Gp6kErpWvM#verkey',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:indy:bcovrin:test:7KuDTpQh3GJ7Gp6kErpWvM',
      publicKeyBase58: '4SySYXQUtuK26zfC7RpQpWYMThfbXphUf8LWyXXmxyTX',
    },
  ],
  authentication: ['did:indy:bcovrin:test:7KuDTpQh3GJ7Gp6kErpWvM#verkey'],
};

describe('Agent', () => {
  const TOKEN = 'AGENT_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    jest
      .spyOn(AgentService.prototype, 'getPublicDid')
      .mockImplementation(() =>
        Promise.resolve(new DidDocument(mockDidDocument)),
      );

    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3000),
        AgentModule,
        ClientsModule.register([{ name: TOKEN, transport: Transport.NATS }]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice({ transport: Transport.NATS });

    await app.startAllMicroservices();
    await app.init();

    client = app.get(TOKEN);
    await client.connect();
  });

  it('info.publicDid', async () => {
    const response$: Observable<EventInfoPublicDid> = client.send(
      'info.publicDid',
      {},
    );

    const response = await firstValueFrom(response$);

    expect(response.data).toMatchObject({
      didDocument: mockDidDocument,
    });
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });
});
