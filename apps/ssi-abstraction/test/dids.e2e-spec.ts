import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventDidsResolveInput,
  EventDidsPublicDidInput,
} from '@ocm/shared';

import { DidDocument } from '@aries-framework/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { EventDidsResolve, EventDidsPublicDid } from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

const mockDidDocument = {
  context: ['https://w3id.org/did/v1'],
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

describe('Dids', () => {
  const TOKEN = 'DIDS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;

  beforeAll(async () => {
    jest
      .spyOn(DidsService.prototype, 'getPublicDid')
      .mockResolvedValue(new DidDocument(mockDidDocument));
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3005),
        AgentModule,
        DidsModule,
        TenantsModule,
        ClientsModule.register([{ name: TOKEN, transport: Transport.NATS }]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice({ transport: Transport.NATS });

    await app.startAllMicroservices();
    await app.init();

    client = app.get(TOKEN);
    await client.connect();

    const ts = app.get(TenantsService);
    const { id } = await ts.create(TOKEN);
    tenantId = id;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventDidsPublicDid.token, async () => {
    const response$ = client.send<EventDidsPublicDid, EventDidsPublicDidInput>(
      EventDidsPublicDid.token,
      { tenantId },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsPublicDid.fromEvent(response);

    expect(eventInstance.instance).toMatchObject(mockDidDocument);
  });

  it(EventDidsResolve.token, async () => {
    const response$ = client.send<EventDidsResolve, EventDidsResolveInput>(
      EventDidsResolve.token,
      {
        did: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
        tenantId,
      },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsResolve.fromEvent(response);

    expect(eventInstance.instance.toJSON()).toStrictEqual({
      '@context': [
        'https://w3id.org/did/v1',
        'https://w3id.org/security/suites/ed25519-2018/v1',
        'https://w3id.org/security/suites/x25519-2019/v1',
      ],
      id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      verificationMethod: [
        {
          id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          type: 'Ed25519VerificationKey2018',
          controller:
            'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          publicKeyBase58: 'B12NYF8RrR3h41TDCTJojY59usg3mbtbjnFs7Eud1Y6u',
        },
      ],
      authentication: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      assertionMethod: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      keyAgreement: [
        {
          id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc',
          type: 'X25519KeyAgreementKey2019',
          controller:
            'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          publicKeyBase58: 'JhNWeSVLMYccCk7iopQW4guaSJTojqpMEELgSLhKwRr',
        },
      ],
      capabilityInvocation: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      capabilityDelegation: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
    });
  });
});
