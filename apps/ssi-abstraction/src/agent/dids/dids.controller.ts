import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidsPublicDid,
  EventDidsPublicDidInput,
  EventDidsResolve,
  EventDidsResolveInput,
} from '@ocm/shared';

import { DidsService } from './dids.service.js';

@Controller('dids')
export class DidsController {
  public constructor(private didsService: DidsService) {}

  @MessagePattern(EventDidsPublicDid.token)
  public async publicDid(options: EventDidsPublicDidInput) {
    return new EventDidsPublicDid(
      await this.didsService.getPublicDid(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidsResolve.token)
  public async resolve(options: EventDidsResolveInput) {
    return new EventDidsResolve(
      await this.didsService.resolve(options),
      options.tenantId,
    );
  }
}
