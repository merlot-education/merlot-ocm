import type { AnonCredsSchema } from '@aries-framework/anoncreds';
import type { IndyVdrRegisterSchemaOptions } from '@aries-framework/indy-vdr';
import type {
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class SchemasService {
  public withTenantService: WithTenantService;

  public constructor(withTenantService: WithTenantService) {
    this.withTenantService = withTenantService;
  }

  public async getAll({
    tenantId,
  }: EventAnonCredsSchemasGetAllInput): Promise<Array<AnonCredsSchema>> {
    return this.withTenantService.invoke(tenantId, async (t) =>
      (await t.modules.anoncreds.getCreatedSchemas({})).map((r) => r.schema),
    );
  }

  public async getById({
    tenantId,
    schemaId,
  }: EventAnonCredsSchemasGetByIdInput): Promise<AnonCredsSchema | null> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { schema } = await t.modules.anoncreds.getSchema(schemaId);
      return schema ?? null;
    });
  }

  public async register({
    tenantId,
    name,
    version,
    issuerDid,
    attributeNames,
  }: EventAnonCredsSchemasRegisterInput): Promise<AnonCredsSchema> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { schemaState } =
        await t.modules.anoncreds.registerSchema<IndyVdrRegisterSchemaOptions>({
          schema: {
            version,
            name,
            issuerId: issuerDid,
            attrNames: attributeNames,
          },
          options: {
            endorserMode: 'external',
            endorserDid: issuerDid,
          },
        });

      if (schemaState.state !== 'finished' && schemaState.state !== 'action') {
        throw new Error(
          `Error registering schema: ${
            schemaState.state === 'failed' ? schemaState.reason : 'Not Finished'
          }`,
        );
      }

      return schemaState.schema;
    });
  }
}
