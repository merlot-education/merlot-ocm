import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ATTESTATION, Connection, NATSServices } from '../common/constants.js';
import PresentationSubscriptionEndpointDto from '../presentationProof/entities/presentationSubscribeEndPoint.entity.js';

@Injectable()
export default class NatsClientService {
  constructor(@Inject(NATSServices.SERVICE_NAME) private client: ClientProxy) {}

  getConnectionById(connectionId: string) {
    const pattern = {
      endpoint: `${Connection.NATS_ENDPOINT}/${Connection.GET_CONNECTION_By_ID}`,
    };
    const payload = { connectionId };
    return lastValueFrom(this.client.send(pattern, payload));
  }

  publishPresentation(data: PresentationSubscriptionEndpointDto) {
    this.client.emit(
      `${NATSServices.SERVICE_NAME}/${NATSServices.PRESENTATION_SUBSCRIBER_ENDPOINT}`,
      data,
    );
  }

  getCredentialsTypeDetails(type: string) {
    const pattern = {
      endpoint: `${ATTESTATION.ATTESTATION_MANAGER_SERVICE}/${ATTESTATION.GET_MEMBERSHIP_CREDENTIALS_DETAILS}`,
    };
    const payload = { type };
    return lastValueFrom(this.client.send(pattern, payload));
  }

  makeConnectionTrusted(connectionId: string) {
    const pattern = {
      endpoint: `${Connection.NATS_ENDPOINT}/${Connection.MAKE_CONNECTION_TRUSTED}`,
    };
    const payload = { connectionId };
    return lastValueFrom(this.client.send(pattern, payload));
  }
}
