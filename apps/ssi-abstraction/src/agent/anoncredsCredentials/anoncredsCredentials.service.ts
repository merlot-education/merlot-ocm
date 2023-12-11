import type {
  EventDidcommAnonCredsCredentialsGetAllInput,
  EventDidcommAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import {
  AutoAcceptCredential,
  type CredentialExchangeRecord,
} from '@aries-framework/core';
import { Injectable } from '@nestjs/common';

import { MetadataTokens } from '../../common/constants.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class AnonCredsCredentialsService {
  public constructor(private withTenantService: WithTenantService) {}

  public async getAll({
    tenantId,
  }: EventDidcommAnonCredsCredentialsGetAllInput): Promise<
    Array<CredentialExchangeRecord>
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.getAll(),
    );
  }

  public async getById({
    tenantId,
    credentialRecordId,
  }: EventDidcommAnonCredsCredentialsGetByIdInput): Promise<CredentialExchangeRecord | null> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.findById(credentialRecordId),
    );
  }

  public async offer({
    tenantId,
    connectionId,
    credentialDefinitionId,
    attributes,
  }: EventDidcommAnonCredsCredentialsOfferInput): Promise<CredentialExchangeRecord> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.offerCredential({
        protocolVersion: 'v2',
        connectionId,
        credentialFormats: {
          anoncreds: { credentialDefinitionId, attributes },
        },
      }),
    );
  }

  public async offerToSelf({
    tenantId,
    credentialDefinitionId,
    attributes,
  }: EventDidcommAnonCredsCredentialsOfferToSelfInput): Promise<CredentialExchangeRecord> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const connections = await t.connections.getAll();
      const connection = connections.find((c) => {
        const metadata = c.metadata.get<{ withSelf: boolean }>(
          MetadataTokens.GAIA_X_CONNECTION_METADATA_KEY,
        );
        return metadata && metadata.withSelf === true;
      });

      if (!connection) {
        throw new Error(
          'Cannot offer a credential to yourself as there is no connection',
        );
      }

      if (!connection.isReady) {
        throw new Error('Connection with yourself is not ready, yet');
      }

      return t.credentials.offerCredential({
        protocolVersion: 'v2',
        autoAcceptCredential: AutoAcceptCredential.Always,
        connectionId: connection.id,
        credentialFormats: {
          anoncreds: { credentialDefinitionId, attributes },
        },
      });
    });
  }
}
