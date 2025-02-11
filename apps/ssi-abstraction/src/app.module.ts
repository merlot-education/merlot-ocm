import { DidsModule } from '@aries-framework/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@ocm/shared';

import { AgentModule } from './agent/agent.module.js';
import { AnonCredsCredentialsModule } from './agent/anoncredsCredentials/anoncredsCredentials.module.js';
import { ConnectionsModule } from './agent/connections/connections.module.js';
import { CredentialDefinitionsModule } from './agent/credentialDefinitions/credentialDefinitions.module.js';
import { SchemasModule } from './agent/schemas/schemas.module.js';
import { TenantsModule } from './agent/tenants/tenants.module.js';
import { config } from './config/config.js';
import { validationSchema } from './config/validation.js';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    AgentModule,
    ConnectionsModule,
    SchemasModule,
    CredentialDefinitionsModule,
    DidsModule,
    SchemasModule,
    AnonCredsCredentialsModule,
    TenantsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
