import Joi from 'joi';

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  AGENT_URL: Joi.string().required(),
  NATS_URL: Joi.string().required(),
  PORT: Joi.number().required(),
  ACCEPT_MEMBERSHIP_CREDENTIALS_CONFIG: Joi.string().required(),
  USE_AUTH: Joi.string(),
  OAUTH_CLIENT_ID: Joi.string(),
  OAUTH_CLIENT_SECRET: Joi.string(),
  OAUTH_TOKEN_URL: Joi.string(),
});

export default validationSchema;
