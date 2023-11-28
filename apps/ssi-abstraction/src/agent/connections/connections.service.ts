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
