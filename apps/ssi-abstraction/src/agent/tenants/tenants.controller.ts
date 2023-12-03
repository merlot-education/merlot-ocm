import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventTenantsCreate, EventTenantsCreateInput } from '@ocm/shared';

import { TenantsService } from './tenants.service.js';

@Controller('tenants')
export class TenantsController {
  public constructor(private tenantsService: TenantsService) {}

  @MessagePattern(EventTenantsCreate.token)
  public async create({
    label,
  }: EventTenantsCreateInput): Promise<EventTenantsCreate> {
    return new EventTenantsCreate(
      await this.tenantsService.create(label),
      undefined,
    );
  }
}
