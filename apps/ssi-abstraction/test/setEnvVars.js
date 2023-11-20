process.env.PORT = 3009;
process.env.AFJ_EXT_PORT = 3010;
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/postgres?schema=agent';
process.env.NATS_URL = 'nats://localhost:4222';
process.env.ECSURL = 'http://localhost:9200/';
process.env.AGENT_HOST = 'http://localhost';
process.env.AGENT_NAME = 'ssi-abstraction-agent';
process.env.AGENT_PEER_PORT = ':4000';
process.env.AGENT_URL_PATH = '/ocm/abstraction';
process.env.AGENT_PUBLIC_DID_SEED = '6b8b882e2618fa5d45ee7229ca880083';
process.env.AGENT_AUTO_ACCEPT_CONNECTION = true;
process.env.AGENT_AUTO_ACCEPT_CREDENTIAL = true;
process.env.AGENT_WALLET_KEY = 'ssi-wallet-key';
process.env.AGENT_WALLET_ID = 'ssi-wallet-id';
process.env.AGENT_LEDGER_ID = 'ID_UNION';
