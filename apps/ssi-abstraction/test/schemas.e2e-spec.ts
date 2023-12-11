import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Schemas', () => {
  const TOKEN = 'SCHEMAS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;
  let issuerDid: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),
        AgentModule,
        SchemasModule,
        TenantsModule,
        DidsModule,
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

    const ds = app.get(DidsService);
    const [did] = await ds.registerDidIndyFromSeed({
      tenantId,
      seed: '12312367897123300000000000000000',
    });
    issuerDid = did;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventAnonCredsSchemasGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsSchemasGetAll,
      EventAnonCredsSchemasGetAllInput
    >(EventAnonCredsSchemasGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsSchemasGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsSchemasGetById,
      EventAnonCredsSchemasGetByIdInput
    >(EventAnonCredsSchemasGetById.token, { tenantId, schemaId: 'some-id' });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventAnonCredsSchemasRegister.token, async () => {
    const version = `1.${new Date().getTime()}`;
    const attributeNames = ['names', 'age'];
    const name = 'my-schema';
    const response$ = client.send<
      EventAnonCredsSchemasRegister,
      EventAnonCredsSchemasRegisterInput
    >(EventAnonCredsSchemasRegister.token, {
      tenantId,
      name,
      version,
      issuerDid,
      attributeNames,
    });

    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasRegister.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      attrNames: attributeNames,
      issuerId: issuerDid,
      name,
      version,
    });
  });
});
