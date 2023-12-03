import type { BaseEventInput } from './baseEvents.js';

import { JsonTransformer } from '@aries-framework/core';
import { TenantRecord } from '@aries-framework/tenants';

import { BaseEvent } from './baseEvents.js';

export type EventTenantsCreateInput = BaseEventInput<
  { label: string },
  undefined
>;
export class EventTenantsCreate extends BaseEvent<TenantRecord, undefined> {
  public static token = 'tenants.create';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, TenantRecord);
  }

  public static fromEvent(e: EventTenantsCreate) {
    return new EventTenantsCreate(e.data, undefined, e.id, e.type, e.timestamp);
  }
}
