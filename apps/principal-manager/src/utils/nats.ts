import { connect, NatsConnection, StringCodec } from 'nats';

const sc = StringCodec();

export default class Nats {
  private static nc: NatsConnection | null = null;

  public static async initialize(natsConfig: {
    servers: Array<string> | string;
    name: string;
  }): Promise<NatsConnection | null> {
    this.nc = await connect(natsConfig);

    return this.nc;
  }

  public static async publish(subject: string, payload: string) {
    if (this.nc) {
      this.nc.publish(subject, sc.encode(payload));
    } else {
      throw new Error('Initialize Nats First!!');
    }
  }

  public static async subscribe(
    subject: string,
    cb: (...args: unknown[]) => unknown,
  ) {
    if (this.nc) {
      const sub = this.nc.subscribe(subject);
      (async () => {
        // airbnb rule for this lint is outdated
        // eslint-disable-next-line
        for await (const m of sub) {
          cb(sc.decode(m.data));
        }
      })();
    } else {
      throw new Error('Initialize Nats First!!');
    }
  }
}
