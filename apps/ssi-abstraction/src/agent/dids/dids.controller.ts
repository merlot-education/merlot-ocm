import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDidsResolve } from '@ocm/shared';

import { DidsService } from './dids.service.js';

@Controller('dids')
export class DidsController {
  public constructor(private didsService: DidsService) {}

  @MessagePattern('dids.resolve')
  public async resolve({ did }: { did: string }) {
    return new EventDidsResolve(await this.didsService.resolve(did));
  }
}
