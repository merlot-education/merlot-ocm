import Joi from 'joi';

export const validationSchema = Joi.object({
  NATS_URL: Joi.string().required(),
  PORT: Joi.number().required(),

  AGENT_NAME: Joi.string().required(),
  AGENT_WALLET_ID: Joi.string().required(),
  AGENT_WALLET_KEY: Joi.string().required(),
  AGENT_HOST: Joi.string().required(),
  AGENT_INBOUND_PORT: Joi.string(),
  AGENT_URL_PATH: Joi.string(),
  AGENT_PUBLIC_DID_SEED: Joi.string().required(),
  AGENT_AUTO_ACCEPT_CONNECTION: Joi.boolean().required(),
  AGENT_AUTO_ACCEPT_CREDENTIAL: Joi.string().required(),
  AGENT_ID_UNION_KEY: Joi.string(),
});
