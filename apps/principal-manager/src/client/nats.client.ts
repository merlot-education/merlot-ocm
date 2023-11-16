import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseType } from 'openid-client';
import { lastValueFrom } from 'rxjs';
import { Attestation, NATSServices } from '../common/constants.js';
import OfferMembershipCredentialDto from '../principal/entities/offerMembershipCredentialDto.entity.js';
import logger from '../utils/logger.js';

@Injectable()
export default class NatsClientService {
  constructor(@Inject(NATSServices.SERVICE_NAME) private client: ClientProxy) {}

  OfferMembershipCredential(data: OfferMembershipCredentialDto) {
    const pattern = {
      endpoint: `${Attestation.NATS_ENDPOINT}/${Attestation.OFFER_MEMBERSHIP_CREDENTIALS}`,
    };
    const payload = { ...data };
    logger.info(`before sending data to Attestation manager ${payload}`);
    return lastValueFrom(this.client.send<ResponseType>(pattern, payload));
  }
}
