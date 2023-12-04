import type { LedgerIds } from '../config/ledger.js';
import type { InitConfig } from '@aries-framework/core';
import type { IndyVdrPoolConfig } from '@aries-framework/indy-vdr';
import type { OnApplicationShutdown } from '@nestjs/common';

import { AnonCredsModule } from '@aries-framework/anoncreds';
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs';
import { AskarModule } from '@aries-framework/askar';
import {
  Agent,
  ConnectionsModule,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  JwkDidRegistrar,
  JwkDidResolver,
  KeyDidRegistrar,
  KeyDidResolver,
  LogLevel,
  PeerDidRegistrar,
  PeerDidResolver,
  WebDidResolver,
} from '@aries-framework/core';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  IndyVdrSovDidResolver,
} from '@aries-framework/indy-vdr';
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node';
import { TenantsModule } from '@aries-framework/tenants';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from '@ocm/shared';

import { LEDGERS } from '../config/ledger.js';

import { AgentLogger } from './logger.js';

export type AppAgent = Agent<AgentService['modules']>;

@Injectable()
export class AgentService implements OnApplicationShutdown {
  public agent: AppAgent;

  private configService: ConfigService;

  public constructor(configService: ConfigService) {
    this.configService = configService;

    const inboundPort = this.configService.get('agent.inboundPort');
    this.agent = new Agent({
      config: this.config,
      modules: this.modules,
      dependencies: agentDependencies,
    });

    const httpInbound = new HttpInboundTransport({
      port: inboundPort,
    });

    this.agent.registerInboundTransport(httpInbound);

    this.agent.registerOutboundTransport(new HttpOutboundTransport());
  }

  public get config(): InitConfig {
    const { name, walletId, walletKey, host, inboundPort, path } =
      this.configService.get('agent');

    const endpoints = [`${host}:${inboundPort}${path}`];

    return {
      label: name,
      walletConfig: {
        id: walletId,
        key: walletKey,
      },
      endpoints,
      logger: new AgentLogger(LogLevel.off),
    };
  }

  public get modules() {
    const { autoAcceptConnection, autoAcceptCredential } =
      this.configService.get('agent');

    return {
      connections: new ConnectionsModule({
        autoAcceptConnections: autoAcceptConnection,
      }),
      credentials: new CredentialsModule({
        autoAcceptCredentials: autoAcceptCredential,
      }),

      anoncredsRs: new AnonCredsRsModule({ anoncreds }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry()],
      }),
      indyVdr: new IndyVdrModule({ indyVdr, networks: this.ledgers }),

      dids: new DidsModule({
        resolvers: [
          new IndyVdrIndyDidResolver(),
          new IndyVdrSovDidResolver(),
          new PeerDidResolver(),
          new KeyDidResolver(),
          new JwkDidResolver(),
          new WebDidResolver(),
        ],
        registrars: [
          new PeerDidRegistrar(),
          new KeyDidRegistrar(),
          new JwkDidRegistrar(),
        ],
      }),

      askar: new AskarModule({ ariesAskar }),

      tenants: new TenantsModule(),
    };
  }

  private get ledgers() {
    const ledgerIds = this.configService.get('agent.ledgerIds');

    if (!ledgerIds || ledgerIds.length < 1 || ledgerIds[0] === '') {
      return [];
    }

    return ledgerIds.map((id: LedgerIds) => {
      const ledgerId: LedgerIds = id;

      if (!LEDGERS[ledgerId]) {
        throw new Error(
          `No pool transaction genesis provided for ledger ${ledgerId}`,
        );
      }

      const ledger: IndyVdrPoolConfig = {
        indyNamespace: LEDGERS[ledgerId].namespace,
        genesisTransactions: LEDGERS[ledgerId].genesisTransaction,
        isProduction: false,
      };

      return ledger;
    });
  }

  public async onModuleInit() {
    await this.agent.initialize();
    logger.info('Agent initialized');
  }

  public async onApplicationShutdown() {
    if (!this.agent.isInitialized) return;

    // If we cannot shutdown the wallet on application shutdown, no error will occur
    // This is done because the Askar shutdown procedure is a bit buggy
    try {
      await this.agent.shutdown();
      // eslint-disable-next-line no-empty
    } catch {}
  }
}
