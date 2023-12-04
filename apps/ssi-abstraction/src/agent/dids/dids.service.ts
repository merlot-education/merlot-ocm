import type { EventDidsResolveInput } from '@ocm/shared';

import { KeyType, TypedArrayEncoder } from '@aries-framework/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { registerPublicDids } from '../ledger/register.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class DidsService {
  private withTenantService: WithTenantService;
  private configService: ConfigService;

  public constructor(
    withTenantService: WithTenantService,
    configService: ConfigService,
  ) {
    this.withTenantService = withTenantService;
    this.configService = configService;
  }

  public async resolve({ did, tenantId }: EventDidsResolveInput) {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const {
        didDocument,
        didResolutionMetadata: { message, error },
      } = await t.dids.resolve(did);

      if (!didDocument) {
        throw new Error(
          `Could not resolve did: '${did}'. Error: ${
            error ?? 'None'
          } Message: ${message ?? 'None'}`,
        );
      }

      return didDocument;
    });
  }

  public async registerDidIndyFromSeed({
    tenantId,
    seed,
  }: {
    tenantId: string;
    seed: string;
  }): Promise<Array<string>> {
    const ledgerIds = this.configService.get('agent.ledgerIds');

    const registeredPublicDidResponses = await registerPublicDids({
      ledgerIds,
      seed,
    });

    for (const publicDidResponse of registeredPublicDidResponses) {
      await this.withTenantService.invoke(tenantId, (t) =>
        t.dids.import({
          overwrite: true,
          did: publicDidResponse.did,
          privateKeys: [
            {
              keyType: KeyType.Ed25519,
              privateKey: TypedArrayEncoder.fromString(seed),
            },
          ],
        }),
      );
    }

    return registeredPublicDidResponses.map((r) => r.did);
  }
}
