import { subscribe } from './listener.js';

describe('listener', () => {
  it('should subscribe agent to available events', async () => {
    const agent = {
      events: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        on: (eventName: string, cb: () => void) => {},
      },
    };

    const natsClient = {
      publish: () => {},
    };
    const spyPublish = jest.spyOn(natsClient, 'publish');

    let lastCb = null;

    const spy = jest
      .spyOn(agent.events, 'on')
      .mockImplementation((eventName: string, cb: () => void) => {
        lastCb = cb;
      });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    subscribe(agent, natsClient);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(7);
    spy.mockRestore();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lastCb({ payload: 'payload' });
    expect(spyPublish).toHaveBeenCalled();
    expect(spyPublish).toHaveBeenCalledTimes(1);
  });
});
