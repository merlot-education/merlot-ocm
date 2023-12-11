import type { BaseEventInput } from './baseEvents.js';

import { DidDocument, JsonTransformer } from '@aries-framework/core';

import { BaseEvent } from './baseEvents.js';

export type EventDidsResolveInput = BaseEventInput<{ did: string }>;
export class EventDidsResolve extends BaseEvent<DidDocument> {
  public static token = 'dids.resolve';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, DidDocument);
  }

  public static fromEvent(e: EventDidsResolve) {
    return new EventDidsResolve(e.data, e.tenantId, e.id, e.type, e.timestamp);
  }
}

export type EventDidsRegisterIndyFromSeedInput = BaseEventInput<{
  seed: string;
}>;
export class EventDidsRegisterIndyFromSeed extends BaseEvent<Array<string>> {
  public static token = 'dids.register.indy.fromSeed';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventDidsRegisterIndyFromSeed) {
    return new EventDidsRegisterIndyFromSeed(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
