import { Agent } from '@aries-framework/core';
import logger from '@src/globalUtils/logger';
import { NatsClientService } from '@src/client/nats.client';
import { listenerConfig } from './listenerConfig';

/**
 * Subscribes to events on nats
 *
 * @param agent - the agent that has been initialized on startup
 * @param natsClient - the client that specifies how events are published
 */
export const subscribe = (agent: Agent, natsClient: NatsClientService) => {
  for (let i = 0; i < listenerConfig.length; i += 1) {
    agent.events.on(listenerConfig[i], ({ payload }) => {
      logger.info(
        `${listenerConfig[i]} called. Payload: ${JSON.stringify(payload)}`,
      );
      natsClient.publish(listenerConfig[i], payload);
    });
  }
};

export default {
  subscribe,
};
