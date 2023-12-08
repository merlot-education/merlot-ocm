import { registerAs } from '@nestjs/config';

export const natsConfig = registerAs('nats', () => ({
  url: process.env.NATS_URL,
  monitoringUrl: process.env.NATS_MONITORING_URL,
}));
