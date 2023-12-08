import Joi from 'joi';

export const validationSchema = Joi.object({
  HTTP_HOST: Joi.string().default('0.0.0.0'),
  HTTP_PORT: Joi.number().default(3000),

  NATS_URL: Joi.string().uri().default('nats://localhost:4222'),
  NATS_MONITORING_URL: Joi.string().uri().default('http://localhost:8222'),

  SSI_AGENT_URL: Joi.string().default('http://localhost:3010'),
});
