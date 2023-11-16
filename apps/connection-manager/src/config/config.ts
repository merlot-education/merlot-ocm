import { fileURLToPath } from 'node:url';

const parentDirectory = fileURLToPath(new URL('..', import.meta.url));

const config = () => ({
  PORT: Number(process.env.PORT),
  APP_URL: process.env.CONNECTION_MANAGER_URL,
  auth: {
    useAuth: process.env.USE_AUTH || 'false',
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
  },
  nats: {
    url: process.env.NATS_URL,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 5432,
    synchronize: false,
    logging: false,
    entities: [`${parentDirectory}/../**/**.model{.ts,.js}`],
    DATABASE_URL: process.env.DATABASE_URL,
  },
  agent: {
    agentUrl: process.env.AGENT_URL,
  },
  ECSURL: process.env.ECSURL,
});
export default config;
