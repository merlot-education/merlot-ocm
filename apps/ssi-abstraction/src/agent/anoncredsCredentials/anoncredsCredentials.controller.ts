import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidcommAnonCredsCredentialsGetAll,
  EventDidcommAnonCredsCredentialsGetAllInput,
  EventDidcommAnonCredsCredentialsGetById,
  EventDidcommAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
  EventDidcommAnonCredsCredentialsOfferToSelf,
} from '@ocm/shared';

import { AnonCredsCredentialsService } from './anoncredsCredentials.service.js';

@Controller('anoncredsCredentials')
export class AnonCredsCredentialsController {
  public constructor(private credentialsService: AnonCredsCredentialsService) {}

  @MessagePattern(EventDidcommAnonCredsCredentialsGetAll.token)
  public async getAll(
    options: EventDidcommAnonCredsCredentialsGetAllInput,
  ): Promise<EventDidcommAnonCredsCredentialsGetAll> {
    return new EventDidcommAnonCredsCredentialsGetAll(
      await this.credentialsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsGetById.token)
  public async getById(
    options: EventDidcommAnonCredsCredentialsGetByIdInput,
  ): Promise<EventDidcommAnonCredsCredentialsGetById> {
    return new EventDidcommAnonCredsCredentialsGetById(
      await this.credentialsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsOffer.token)
  public async offer(
    options: EventDidcommAnonCredsCredentialsOfferInput,
  ): Promise<EventDidcommAnonCredsCredentialsOffer> {
    return new EventDidcommAnonCredsCredentialsOffer(
      await this.credentialsService.offer(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsOfferToSelf.token)
  public async offerToSelf(
    options: EventDidcommAnonCredsCredentialsOfferToSelfInput,
  ): Promise<EventDidcommAnonCredsCredentialsOfferToSelf> {
    return new EventDidcommAnonCredsCredentialsOfferToSelf(
      await this.credentialsService.offerToSelf(options),
      options.tenantId,
    );
  }
}
