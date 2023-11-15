import Joi from 'joi';

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  NATS_URL: Joi.string().required(),
  PORT: Joi.number().required(),
  CONNECTION_MANAGER_URL: Joi.string().required(),
  USE_AUTH: Joi.string(),
  AGENT_URL: Joi.string().required(),
  OAUTH_CLIENT_ID: Joi.string(),
  OAUTH_CLIENT_SECRET: Joi.string(),
  OAUTH_TOKEN_URL: Joi.string(),
});

export default validationSchema;
