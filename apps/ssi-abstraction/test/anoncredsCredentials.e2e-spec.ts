import type { INestApplication } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventDidcommAnonCredsCredentialsGetAllInput,
  EventDidcommAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import { AutoAcceptCredential } from '@aries-framework/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidcommAnonCredsCredentialsGetAll,
  EventDidcommAnonCredsCredentialsGetById,
  EventDidcommAnonCredsCredentialsOfferToSelf,
} from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { AnonCredsCredentialsModule } from '../src/agent/anoncredsCredentials/anoncredsCredentials.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { ConnectionsService } from '../src/agent/connections/connections.service.js';
import { CredentialDefinitionsModule } from '../src/agent/credentialDefinitions/credentialDefinitions.module.js';
import { CredentialDefinitionsService } from '../src/agent/credentialDefinitions/credentialDefinitions.service.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { SchemasService } from '../src/agent/schemas/schemas.service.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Credentials', () => {
  const TOKEN = 'CREDENTIALS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;

  let issuerDid: string;
  let credentialDefinitionId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),
        AgentModule,
        ConnectionsModule,
        SchemasModule,
        CredentialDefinitionsModule,
        AnonCredsCredentialsModule,
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

    const tenantsService = app.get(TenantsService);
    const { id } = await tenantsService.create(TOKEN);
    tenantId = id;

    const connectionsService = app.get(ConnectionsService);
    await connectionsService.createConnectionWithSelf({ tenantId });

    const didsService = app.get(DidsService);
    const [did] = await didsService.registerDidIndyFromSeed({
      tenantId,
      seed: '12312367897123300000000000000000',
    });
    issuerDid = did;

    const schemaService = app.get(SchemasService);
    const { schemaId } = await schemaService.register({
      issuerDid,
      tenantId,
      name: 'test-schema-name',
      version: `1.${new Date().getTime()}`,
      attributeNames: ['Name', 'Age'],
    });

    const credentialDefinitionService = app.get(CredentialDefinitionsService);
    const { credentialDefinitionId: cdi } =
      await credentialDefinitionService.register({
        tenantId,
        issuerDid,
        schemaId,
        tag: `default-${new Date().getTime()}`,
      });

    credentialDefinitionId = cdi;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventDidcommAnonCredsCredentialsGetAll.token, async () => {
    const response$ = client.send<
      EventDidcommAnonCredsCredentialsGetAll,
      EventDidcommAnonCredsCredentialsGetAllInput
    >(EventDidcommAnonCredsCredentialsGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsCredentialsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventDidcommAnonCredsCredentialsGetById.token, async () => {
    const response$ = client.send<
      EventDidcommAnonCredsCredentialsGetById,
      EventDidcommAnonCredsCredentialsGetByIdInput
    >(EventDidcommAnonCredsCredentialsGetById.token, {
      tenantId,
      credentialRecordId: 'some-id',
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsCredentialsGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventDidcommAnonCredsCredentialsOfferToSelf.token, async () => {
    const attributes = [
      { name: 'Name', value: 'Berend' },
      { name: 'Age', value: '25' },
    ];

    const response$ = client.send<
      EventDidcommAnonCredsCredentialsOfferToSelf,
      EventDidcommAnonCredsCredentialsOfferToSelfInput
    >(EventDidcommAnonCredsCredentialsOfferToSelf.token, {
      tenantId,
      credentialDefinitionId,
      attributes,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsCredentialsOfferToSelf.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      autoAcceptCredential: AutoAcceptCredential.Always,
    });
  });
});
