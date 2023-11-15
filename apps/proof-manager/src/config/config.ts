import { fileURLToPath } from 'node:url';

const parentDirectory = fileURLToPath(new URL('..', import.meta.url));

const config = () => ({
  PORT: Number(process.env.PORT),
  APP_URL: process.env.PROOF_MANAGER_URL,
  nats: {
    url: process.env.NATS_URL,
  },
  auth: {
    useAuth: process.env.USE_AUTH || 'false',
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
  },
  agent: {
    agentUrl: process.env.AGENT_URL,
    didcommUrl: process.env.DIDCOMM_URL,
  },
  DATABASE: {
    type: 'postgres',
    port: 5432,
    synchronize: false,
    logging: false,
    entities: [`${parentDirectory}/../**/**.model{.ts,.js}`],
  },
  ECSURL: process.env.ECSURL,
  ACCEPT_PRESENTATION_CONFIG: process.env.ACCEPT_PRESENTATION_CONFIG,
});
export default config;
