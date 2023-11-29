import { registerAs } from '@nestjs/config';

export const ssiConfig = registerAs('ssi', () => ({
  agentUrl: process.env.SSI_AGENT_URL,
}));
