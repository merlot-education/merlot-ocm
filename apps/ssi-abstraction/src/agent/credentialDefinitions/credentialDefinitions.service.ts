import type { AnonCredsCredentialDefinition } from '@aries-framework/anoncreds';
import type { IndyVdrRegisterCredentialDefinitionOptions } from '@aries-framework/indy-vdr';
import type {
  EventAnonCredsCredentialDefinitionsGetAllInput,
  EventAnonCredsCredentialDefinitionsGetByIdInput,
  EventAnonCredsCredentialDefinitionsRegisterInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class CredentialDefinitionsService {
  public withTenantService: WithTenantService;

  public constructor(withTenantService: WithTenantService) {
    this.withTenantService = withTenantService;
  }

  public async getAll({
    tenantId,
  }: EventAnonCredsCredentialDefinitionsGetAllInput): Promise<
    Array<AnonCredsCredentialDefinition>
  > {
    return this.withTenantService.invoke(tenantId, async (t) =>
      (await t.modules.anoncreds.getCreatedCredentialDefinitions({})).map(
        (r) => r.credentialDefinition,
      ),
    );
  }

  public async getById({
    tenantId,
    credentialDefinitionId,
  }: EventAnonCredsCredentialDefinitionsGetByIdInput): Promise<AnonCredsCredentialDefinition | null> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { credentialDefinition } =
        await t.modules.anoncreds.getCredentialDefinition(
          credentialDefinitionId,
        );
      return credentialDefinition ?? null;
    });
  }

  public async register({
    tenantId,
    schemaId,
    issuerDid,
    tag,
  }: EventAnonCredsCredentialDefinitionsRegisterInput): Promise<
    AnonCredsCredentialDefinition & { credentialDefinitionId: string }
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { credentialDefinitionState } =
        await t.modules.anoncreds.registerCredentialDefinition<IndyVdrRegisterCredentialDefinitionOptions>(
          {
            credentialDefinition: {
              issuerId: issuerDid,
              type: 'CL',
              schemaId,
              tag,
            },
            options: {
              endorserMode: 'internal',
              endorserDid: issuerDid,
            },
          },
        );

      if (credentialDefinitionState.state !== 'finished') {
        throw new Error(
          `Error registering credentialDefinition: ${
            credentialDefinitionState.state === 'failed'
              ? credentialDefinitionState.reason
              : 'Not Finished'
          }`,
        );
      }

      return {
        credentialDefinitionId:
          credentialDefinitionState.credentialDefinitionId,
        ...credentialDefinitionState.credentialDefinition,
      };
    });
  }
}
