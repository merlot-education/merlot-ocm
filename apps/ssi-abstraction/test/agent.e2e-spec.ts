import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { firstValueFrom, type Observable } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { AgentService } from '../src/agent/agent.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Agent', () => {
  const TOKEN = 'AGENT_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;

  const agentService = {
    getPublicDid: () =>
      Promise.resolve({
        id: 'test',
      }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule,
        AgentModule,
        ClientsModule.register([{ name: TOKEN, transport: Transport.NATS }]),
      ],
    })
      .overrideProvider(AgentService)
      .useValue(agentService)
      .compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice({ transport: Transport.NATS });

    await app.startAllMicroservices();
    await app.init();

    client = app.get(TOKEN);
    await client.connect();
  });

  it('info.publicDid', async () => {
    const response$: Observable<unknown> = client.send('info.publicDid', {});
    const response = await firstValueFrom(response$);
    expect(response).toMatchObject({ id: 'test' });
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });
});
