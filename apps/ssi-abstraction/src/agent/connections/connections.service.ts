import type { AppAgent } from '../agent.service.js';
import type {
  ConnectionRecord,
  ConnectionStateChangedEvent,
} from '@aries-framework/core';

import {
  ConnectionEventTypes,
  ConnectionRepository,
  DidExchangeState,
} from '@aries-framework/core';
import { isDid } from '@aries-framework/core/build/utils/did.js';
import { Injectable } from '@nestjs/common';

import { MetadataTokens } from '../../common/constants.js';
import { AgentService } from '../agent.service.js';

@Injectable()
export class ConnectionsService {
  public agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async getAll(): Promise<Array<ConnectionRecord>> {
    return await this.agent.connections.getAll();
  }

  public async getById(id: string): Promise<ConnectionRecord | null> {
    return await this.agent.connections.findById(id);
  }

  public async blockByIdOrDid(
    idOrDid: string,
  ): Promise<ConnectionRecord | null> {
    if (isDid(idOrDid)) {
      const records = await this.agent.connections.findAllByQuery({
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

      await this.agent.connections.deleteById(records[0].id);

      return records[0];
    }

    const record = await this.agent.connections.findById(idOrDid);
    if (!record) return null;

    await this.agent.connections.deleteById(record.id);

    return record;
  }

  public async createConnectionWithSelf(): Promise<ConnectionRecord> {
    const outOfBandRecord = await this.agent.oob.createInvitation();
    const invitation = outOfBandRecord.outOfBandInvitation;

    void this.agent.oob.receiveInvitation(invitation);

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

          const connRepo =
            this.agent.dependencyManager.resolve(ConnectionRepository);
          await connRepo.update(this.agent.context, connectionRecord);

          resolve(connectionRecord);
        },
      ),
    );
  }
}
