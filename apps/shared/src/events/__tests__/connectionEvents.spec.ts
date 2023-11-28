import {
  ConnectionRecord,
  DidExchangeRole,
  DidExchangeState,
} from '@aries-framework/core';

import {
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
} from '../connectionEvents.js';

describe('Connection Events', () => {
  it('should return module', () => {
    jest.requireActual('../connectionEvents');
  });

  it('should create a new connections get all event', () => {
    const event = new EventDidcommConnectionsGetAll([]);

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsGetAll');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject([]);
  });

  it('should create a new connections get by id event', () => {
    const event = new EventDidcommConnectionsGetById(null);

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsGetById');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toBeNull();
  });

  it('should create a new connections create with self event', () => {
    const event = new EventDidcommConnectionsCreateWithSelf(
      new ConnectionRecord({
        role: DidExchangeRole.Requester,
        state: DidExchangeState.Completed,
      }),
    );

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsCreateWithSelf');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject({
      role: DidExchangeRole.Requester,
      state: DidExchangeState.Completed,
    });
  });
});
