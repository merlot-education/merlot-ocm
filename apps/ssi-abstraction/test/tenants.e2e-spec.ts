import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type { EventTenantsCreateInput } from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { EventTenantsCreate } from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Tenants', () => {
  const TOKEN = 'TENANTS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3005),
        AgentModule,
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
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventTenantsCreate.token, async () => {
    const response$ = client.send<EventTenantsCreate, EventTenantsCreateInput>(
      EventTenantsCreate.token,
      {
        label: 'my-new-tenant',
      },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventTenantsCreate.fromEvent(response);

    expect(eventInstance.instance.toJSON()).toMatchObject({
      config: {
        label: 'my-new-tenant',
        walletConfig: {
          keyDerivationMethod: 'RAW',
        },
      },
    });
  });
});
