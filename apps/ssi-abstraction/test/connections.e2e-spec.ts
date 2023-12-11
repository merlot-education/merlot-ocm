import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type { Observable } from 'rxjs';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsBlock,
} from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { MetadataTokens } from '../src/common/constants.js';
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

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventDidcommConnectionsGetAll.token, async () => {
    const response$: Observable<EventDidcommConnectionsGetAll> = client.send(
      EventDidcommConnectionsGetAll.token,
      {},
    );
    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventDidcommConnectionsGetById.token, async () => {
    const response$: Observable<EventDidcommConnectionsGetById> = client.send(
      EventDidcommConnectionsGetById.token,
      { id: 'some-id' },
    );
    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsGetById.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });

  it(EventDidcommConnectionsCreateWithSelf.token, async () => {
    const response$: Observable<EventDidcommConnectionsCreateWithSelf> =
      client.send(EventDidcommConnectionsCreateWithSelf.token, {});

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommConnectionsCreateWithSelf.fromEvent(response);

    expect(eventInstance.instance).toHaveProperty('id');
    const metadata = eventInstance.instance.metadata.get(
      MetadataTokens.GAIA_X_CONNECTION_METADATA_KEY,
    );
    expect(metadata).toMatchObject({ trusted: true });
  });

  it(EventDidcommConnectionsBlock.token, async () => {
    const response$: Observable<EventDidcommConnectionsBlock> = client.send(
      EventDidcommConnectionsBlock.token,
      { idOrDid: 'some-id' },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsBlock.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });
});
