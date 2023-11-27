import { BaseEvent, EventDidcommConnectionsGetAll } from './events.js';

describe('check logger', () => {
  it('should return module', () => {
    jest.requireActual('./events');
  });

  it('should create a new base event', () => {
    const baseEvent = new BaseEvent({ some: 'data' });

    expect(typeof baseEvent.id).toStrictEqual('string');
    expect(baseEvent.type).toStrictEqual('BaseEvent');
    expect(baseEvent.timestamp).toBeInstanceOf(Date);
    expect(baseEvent.data).toMatchObject({ some: 'data' });
  });

  it('should create a new connections get all event', () => {
    const getAllConnectionsEvent = new EventDidcommConnectionsGetAll({
      connections: [],
    });

    expect(typeof getAllConnectionsEvent.id).toStrictEqual('string');
    expect(getAllConnectionsEvent.type).toStrictEqual(
      'EventDidcommConnectionsGetAll',
    );
    expect(getAllConnectionsEvent.timestamp).toBeInstanceOf(Date);
    expect(getAllConnectionsEvent.data).toMatchObject({ connections: [] });
  });
});
