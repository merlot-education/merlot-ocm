import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import logger from '@src/globalUtils/logger';
import { Agent, HttpOutboundTransport } from '@aries-framework/core';
import {
  LedgerIds,
  LedgerInfo,
  ledgerNamespaces,
  LEDGER_GENESIS,
  NYM_URL,
} from '@src/agent/agentUtils/ledgerConfig';
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node';
import { subscribe } from '@src/agent/agentUtils/listener';
import { NatsClientService } from '@src/client/nats.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATSServices } from '@common/constants';
import config from '@config/config';
import axios from 'axios';
import LedgerRegistationBody from '@src/didComm/entities/LedgerRegistrationBody';
import { logAxiosError } from './agentUtils/helperFunctions';

export const AGENT = 'agent';

const agentFactory = {
  provide: AGENT,
  useFactory: async (
    configService: ConfigService,
    natsClient: NatsClientService,
  ) => {
    logger.info('Agent initializing...');

    const {
      name,
      walletId,
      walletKey,
      ledgerIds,
      host,
      peerPort,
      path,
      publicDidSeed,
      autoAcceptConnection,
      autoAcceptCredential,
      basicUser,
      basicPass,
    } = configService.get('agent');

    const endpoints = [`${host}${peerPort}${path}`];

    if (!ledgerIds || ledgerIds.length < 1 || ledgerIds[0] === '') {
      throw new Error(
        'Agent could not start, please provide a ledger environment variable.',
      );
    }

    const indyLedgers: LedgerInfo[] = ledgerIds.map((id: LedgerIds) => {
      if (!LEDGER_GENESIS?.[id]) {
        throw new Error(
          `No pool transaction genesis provided for ledger ${id}`,
        );
      }

      const ledger: LedgerInfo = {
        id: `${id}_Genesis`,
        indyNamespace: `${ledgerNamespaces[id]}`,
        genesisTransactions: LEDGER_GENESIS?.[id],
        isProduction: false,
      };

      return ledger;
    });

    const agentConfig = {
      label: name,
      walletConfig: {
        id: walletId,
        key: walletKey,
      },
      indyLedgers,
      publicDidSeed,
      endpoints,
      autoAcceptConnections: autoAcceptConnection,
      autoAcceptCredentials: autoAcceptCredential,
    };

    const agent = new Agent(agentConfig, agentDependencies);

    const httpInbound = new HttpInboundTransport({
      port: Number(peerPort.replace(':', '')),
    });

    agent.registerInboundTransport(httpInbound);

    agent.registerOutboundTransport(new HttpOutboundTransport());

    await agent.initialize();
    subscribe(agent, natsClient);

    if (agent.isInitialized) {
      ledgerIds.map(async (id: LedgerIds) => {
        let body: LedgerRegistationBody = {
          role: 'ENDORSER',
          alias: name,
          did: agent.publicDid?.did,
          verkey: agent.publicDid?.verkey,
        };

        if (id === 'ID_UNION') {
          body = {
            did: agent.publicDid?.did,
            verkey: agent.publicDid?.verkey,
          };
        }

        if (id === 'ID_UNION' && basicPass && basicPass) {
          await axios
            .post(NYM_URL[id], body, {
              auth: {
                username: basicUser,
                password: basicPass,
              },
            })
            .then((res: any) => {
              if (res.data) {
                logger.info('Agent DID registered.');
              }
            })
            .catch((err: any) => {
              // if did is already registered on IdUnion it will catch 500, but it's ok
              logAxiosError(err);
            });
        } else {
          await axios
            .post(NYM_URL[id], body)
            .then((res: any) => {
              if (res.data) {
                logger.info('Agent DID registered.');
              }
            })
            .catch((err: any) => {
              // if did is already registered on IdUnion it will catch 500, but it's ok
              logAxiosError(err);
            });
        }
      });
    }

    logger.info('Agent initialized');

    return agent;
  },
  inject: [ConfigService, NatsClientService],
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATSServices.SERVICE_NAME,
        transport: Transport.NATS,
        options: {
          servers: [config().nats.url],
        },
      },
    ]),
  ],
  controllers: [],
  providers: [agentFactory, NatsClientService],
  exports: [AGENT],
})
export class AgentModule {
  constructor(@Inject(AGENT) private agent: Agent) {}

  async onModuleDestroy() {
    await this.agent.shutdown();
  }
}

export default AgentModule;
