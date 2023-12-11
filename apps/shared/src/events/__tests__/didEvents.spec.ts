import { DidDocument } from '@aries-framework/core';

import { EventDidsPublicDid, EventDidsResolve } from '../didEvents.js';

describe('Did Events', () => {
  it('should return module', () => {
    jest.requireActual('../didEvents');
  });

  it('should create get public did event', () => {
    const doc = new DidDocument({ id: 'did:web:123.com' });
    const event = new EventDidsPublicDid(doc, 'tenantId');

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidsPublicDid');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject(doc);
  });

  it('should create did resolve event', () => {
    const doc = new DidDocument({ id: 'did:my:id' });
    const event = new EventDidsResolve(doc, 'tenantId');

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidsResolve');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject(doc);
  });
});
