import type { AppAgent } from '../agent.service.js';
import type {
  ConnectionRecord,
  ConnectionStateChangedEvent,
} from '@aries-framework/core';
import type {
  EventDidcommConnectionsBlockInput,
  EventDidcommConnectionsCreateWithSelfInput,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetByIdInput,
} from '@ocm/shared';

import {
  ConnectionEventTypes,
  ConnectionRepository,
  DidExchangeState,
} from '@aries-framework/core';
import { isDid } from '@aries-framework/core/build/utils/did.js';
import { Injectable } from '@nestjs/common';

import { MetadataTokens } from '../../common/constants.js';
import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class ConnectionsService {
  public agent: AppAgent;
  public withTenantService: WithTenantService;

  public constructor(
    agentService: AgentService,
    withTenantService: WithTenantService,
  ) {
    this.agent = agentService.agent;
    this.withTenantService = withTenantService;
  }

  public async getAll({
    tenantId,
  }: EventDidcommConnectionsGetAllInput): Promise<Array<ConnectionRecord>> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.connections.getAll(),
    );
  }

  public async getById({
    tenantId,
    id,
  }: EventDidcommConnectionsGetByIdInput): Promise<ConnectionRecord | null> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.connections.findById(id),
    );
  }

  public async blockByIdOrDid({
    tenantId,
    idOrDid,
  }: EventDidcommConnectionsBlockInput): Promise<ConnectionRecord | null> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      if (isDid(idOrDid)) {
        const records = await t.connections.findAllByQuery({
          theirDid: idOrDid,
        });

        if (records.length === 0) {
          return null;
        }

        if (records.length > 1) {
          throw new Error(
            'Found multiple records with the same DID. This should not be possible',
          );
        }

        await t.connections.deleteById(records[0].id);

        return records[0];
      }

      const record = await t.connections.findById(idOrDid);
      if (!record) return null;

      await t.connections.deleteById(record.id);

      return record;
    });
  }

  public async createConnectionWithSelf({
    tenantId,
  }: EventDidcommConnectionsCreateWithSelfInput): Promise<ConnectionRecord> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const outOfBandRecord = await t.oob.createInvitation();
      const invitation = outOfBandRecord.outOfBandInvitation;

      void t.oob.receiveInvitation(invitation);

      return new Promise((resolve) =>
        this.agent.events.on<ConnectionStateChangedEvent>(
          ConnectionEventTypes.ConnectionStateChanged,
          async ({ payload: { connectionRecord } }) => {
            if (connectionRecord.state !== DidExchangeState.Completed) return;
            connectionRecord.metadata.set(
              MetadataTokens.GAIA_X_CONNECTION_METADATA_KEY,
              {
                trusted: true,
              },
            );

            const connRepo = t.dependencyManager.resolve(ConnectionRepository);
            await connRepo.update(t.context, connectionRecord);

            resolve(connectionRecord);
          },
        ),
      );
    });
  }
}
