import type { BaseEventInput } from './baseEvents.js';

import { ConnectionRecord, JsonTransformer } from '@aries-framework/core';

import { BaseEvent } from './baseEvents.js';

export type EventDidcommConnectionsGetAllInput = BaseEventInput;
export class EventDidcommConnectionsGetAll extends BaseEvent<
  Array<ConnectionRecord>
> {
  public static token = 'didcomm.connections.getAll';

  public get instance() {
    return this.data.map((d) => JsonTransformer.fromJSON(d, ConnectionRecord));
  }

  public static fromEvent(e: EventDidcommConnectionsGetAll) {
    return new EventDidcommConnectionsGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommConnectionsGetByIdInput = BaseEventInput<{
  id: string;
}>;
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
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommConnectionsCreateWithSelfInput = BaseEventInput;
export class EventDidcommConnectionsCreateWithSelf extends BaseEvent<ConnectionRecord> {
  public static token = 'didcomm.connections.createWithSelf';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, ConnectionRecord);
  }

  public static fromEvent(e: EventDidcommConnectionsCreateWithSelf) {
    return new EventDidcommConnectionsCreateWithSelf(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommConnectionsBlockInput = BaseEventInput<{
  idOrDid: string;
}>;
export class EventDidcommConnectionsBlock extends BaseEvent<ConnectionRecord | null> {
  public static token = 'didcomm.connections.block';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, ConnectionRecord)
      : null;
  }

  public static fromEvent(e: EventDidcommConnectionsBlock) {
    return new EventDidcommConnectionsBlock(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
