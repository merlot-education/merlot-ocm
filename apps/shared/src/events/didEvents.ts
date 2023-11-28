import { DidDocument, JsonTransformer } from '@aries-framework/core';

import { BaseEvent } from './baseEvents.js';

/**
 *
 * @todo: this should be removed as it is a weird event that should not be needed
 *
 */
export class EventInfoPublicDid extends BaseEvent<DidDocument> {
  public static token = 'dids.publicDid';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, DidDocument);
  }

  public static fromEvent(e: EventInfoPublicDid) {
    return new EventInfoPublicDid(e.data, e.id, e.type, e.timestamp);
  }
}

export class EventDidsResolve extends BaseEvent<DidDocument> {
  public static token = 'dids.resolve';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, DidDocument);
  }

  public static fromEvent(e: EventDidsResolve) {
    return new EventDidsResolve(e.data, e.id, e.type, e.timestamp);
  }
}
