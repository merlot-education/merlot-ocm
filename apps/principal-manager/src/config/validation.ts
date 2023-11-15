import Joi from 'joi';

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  NATS_URL: Joi.string().required(),
  PORT: Joi.number().required(),
  USE_AUTH: Joi.string(),
  OAUTH_CLIENT_ID: Joi.string(),
  OAUTH_CLIENT_SECRET: Joi.string(),
  OAUTH_TOKEN_URL: Joi.string(),
});

export default validationSchema;
