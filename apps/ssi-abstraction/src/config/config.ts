import { AutoAcceptCredential } from '@aries-framework/core';

export interface AppConfig {
  agentHost: string;
  port: number;
  jwtSecret: string;

  nats: {
    url: string;
  };

  agent: {
    name: string;
    walletId: string;
    walletKey: string;
    ledgerIds?: string[];
    host: string;
    inboundPort: number;
    path: string;
    publicDidSeed: string;
    autoAcceptConnection: boolean;
    autoAcceptCredential: AutoAcceptCredential;
  };
}

export const config = (): AppConfig => ({
  agentHost: process.env.AGENT_HOST || '',
  port: parseInt(process.env.PORT || '3000'),
  jwtSecret: process.env.JWT_SECRET || '',

  nats: {
    url: process.env.NATS_URL || '',
  },

  agent: {
    name: process.env.AGENT_NAME || '',
    walletId: process.env.AGENT_WALLET_ID || '',
    walletKey: process.env.AGENT_WALLET_KEY || '',
    ledgerIds: process.env.AGENT_LEDGER_ID?.split(','),
    host: process.env.AGENT_HOST || '',
    inboundPort: Number(process.env.AGENT_INBOUND_PORT || '3001'),
    path: process.env.AGENT_URL_PATH || '',
    publicDidSeed: process.env.AGENT_PUBLIC_DID_SEED || '',
    autoAcceptConnection: process.env.AGENT_AUTO_ACCEPT_CONNECTION === 'true',
    autoAcceptCredential:
      (process.env.AGENT_AUTO_ACCEPT_CREDENTIAL as AutoAcceptCredential) ||
      AutoAcceptCredential.ContentApproved,
  },
});
