import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidsRegisterIndyFromSeed,
  EventDidsRegisterIndyFromSeedInput,
  EventDidsResolve,
  EventDidsResolveInput,
} from '@ocm/shared';

import { DidsService } from './dids.service.js';

@Controller('dids')
export class DidsController {
  public constructor(private didsService: DidsService) {}

  @MessagePattern(EventDidsRegisterIndyFromSeed.token)
  public async registerFromSeed(options: EventDidsRegisterIndyFromSeedInput) {
    return new EventDidsRegisterIndyFromSeed(
      await this.didsService.registerDidIndyFromSeed(options),
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
