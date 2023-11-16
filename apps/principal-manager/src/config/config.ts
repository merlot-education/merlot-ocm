import { fileURLToPath } from 'node:url';

const parentDirectory = fileURLToPath(new URL('..', import.meta.url));
const config = () => ({
  PORT: Number(process.env.PORT),

  nats: {
    url: process.env.NATS_URL,
  },
  auth: {
    useAuth: process.env.USE_AUTH || 'false',
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
  },

  DATABASE: {
    type: 'postgres',
    port: 5432,
    synchronize: false,
    logging: false,
    entities: [`${parentDirectory}/../**/**.model{.ts,.js}`],
  },
  ECSURL: process.env.ECSURL,
});
export default config;
