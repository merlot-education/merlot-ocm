import { registerAs } from '@nestjs/config';

export const httpConfig = registerAs('http', () => ({
  host: process.env.HOST,
  port: Number(process.env.PORT),
}));
