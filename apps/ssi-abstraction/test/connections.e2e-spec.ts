import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type { EventDidcommConnectionsGetAll } from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { firstValueFrom, type Observable } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Connections', () => {
  const TOKEN = 'CONNECTIONS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004),
        AgentModule,
        ConnectionsModule,
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

  it('didcomm.connections.getAll', async () => {
    const response$: Observable<EventDidcommConnectionsGetAll> = client.send(
      'didcomm.connections.getAll',
      {},
    );
    const response = await firstValueFrom(response$);
    expect(response.data).toMatchObject({ connections: [] });
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });
});
