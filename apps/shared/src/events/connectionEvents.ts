import {
  ConnectionRecord,
  DidDocument,
  JsonTransformer,
} from '@aries-framework/core';

import { BaseEvent } from './baseEvents.js';

export class EventInfoPublicDid extends BaseEvent<DidDocument> {
  public static token = 'didcomm.info.publicDid';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, DidDocument);
  }

  public static fromEvent(e: EventInfoPublicDid) {
    return new EventInfoPublicDid(e.data, e.id, e.type, e.timestamp);
  }
}

export class EventDidcommConnectionsGetAll extends BaseEvent<
  Array<ConnectionRecord>
> {
  public static token = 'didcomm.connections.getAll';

  public get instance() {
    return this.data.map((d) => JsonTransformer.fromJSON(d, ConnectionRecord));
  }

  public static fromEvent(e: EventDidcommConnectionsGetAll) {
    return new EventDidcommConnectionsGetAll(e.data, e.id, e.type, e.timestamp);
  }
}

export class EventDidcommConnectionsGetById extends BaseEvent<ConnectionRecord | null> {
  public static token = 'didcomm.connections.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, ConnectionRecord)
      : null;
  }

  public static fromEvent(e: EventDidcommConnectionsGetById) {
    return new EventDidcommConnectionsGetById(
      e.data,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export class EventDidcommConnectionsCreateWithSelf extends BaseEvent<ConnectionRecord> {
  public static token = 'didcomm.connections.createWithSelf';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, ConnectionRecord, {
      validate: true,
    });
  }

  public static fromEvent(e: EventDidcommConnectionsCreateWithSelf) {
    return new EventDidcommConnectionsCreateWithSelf(
      e.data,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
