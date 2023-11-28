import { utils } from '@aries-framework/core';

export class BaseEvent<T = Record<string, unknown>> {
  public readonly id: string;
  public readonly type: string;
  public readonly timestamp: Date;
  public readonly data: T;

  public constructor(data: T, id?: string, type?: string, timestamp?: Date) {
    this.id = id ?? utils.uuid();
    this.type = type ?? this.constructor.name;
    this.timestamp = timestamp ?? new Date();
    this.data = data;
  }
}
