import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATSServices } from '../common/constants.js';
import logger from '../globalUtils/logger.js';

@Injectable()
export class NatsClientService {
  constructor(@Inject(NATSServices.SERVICE_NAME) private client: ClientProxy) {}

  /**
   * Publishes events on nats
   * Generates the event as an object with 'endpoint' key
   * that specifies the ServiceName/eventName.
   *
   * @param eventName - the event name
   * @param data - the data to be passed as payload of the event
   */
  publish(eventName: string, data: any) {
    logger.info(
      `Publish nats event: ${NATSServices.SERVICE_NAME}/${eventName}`,
    );

    const event = {
      endpoint: `${NATSServices.SERVICE_NAME}/${eventName}`,
    };

    this.client.emit(event, data);
  }
}

export default { NatsClientService };
