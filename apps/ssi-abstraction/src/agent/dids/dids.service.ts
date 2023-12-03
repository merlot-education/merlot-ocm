import type {
  EventDidsPublicDidInput,
  EventDidsResolveInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class DidsService {
  public withTenantService: WithTenantService;

  public constructor(withTenantService: WithTenantService) {
    this.withTenantService = withTenantService;
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

  public async getPublicDid({ tenantId }: EventDidsPublicDidInput) {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const dids = await t.dids.getCreatedDids({ method: 'indy' });
      if (dids.length === 0) {
        throw new Error('No registered public DIDs');
      }

      if (dids.length > 1) {
        throw new Error('Multiple public DIDs found');
      }

      const didRecord = dids[0];

      if (!didRecord.didDocument) {
        throw new Error(
          'A public DID was found, but did not include a DID Document',
        );
      }

      return didRecord.didDocument;
    });
  }
}
