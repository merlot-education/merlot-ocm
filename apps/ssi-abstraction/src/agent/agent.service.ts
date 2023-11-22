import type {
  LedgerIds} from './utils/ledgerConfig.js';
import type {
  InitConfig} from '@aries-framework/core';
import type {
  IndyVdrPoolConfig} from '@aries-framework/indy-vdr';

import { AnonCredsModule } from '@aries-framework/anoncreds';
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs';
import { AskarModule } from '@aries-framework/askar';
import {
  Agent,
  ConnectionsModule,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  KeyDidRegistrar,
  KeyDidResolver,
  KeyType,
  LogLevel,
  PeerDidRegistrar,
  PeerDidResolver,
  TypedArrayEncoder,
} from '@aries-framework/core';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  IndyVdrSovDidResolver,
} from '@aries-framework/indy-vdr';
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { logger } from '../globalUtils/logger.js';

import { registerPublicDids } from './ledger/register.js';
import {
  ledgerNamespaces,
  LEDGER_GENESIS,
} from './utils/ledgerConfig.js';
import { AgentLogger } from './utils/logger.js';


export type AppAgent = Agent<AgentService['modules']>;

@Injectable()
export class AgentService {
  public agent: AppAgent;

  private configService: ConfigService;

  public constructor(configService: ConfigService) {
    this.configService = configService;

    const peerPort = this.configService.get('agent.peerPort');

    this.agent = new Agent({
      config: this.config,
      modules: this.modules,
      dependencies: agentDependencies,
    });

    const httpInbound = new HttpInboundTransport({
      port: Number(peerPort.replace(':', '')),
    });

    this.agent.registerInboundTransport(httpInbound);

    this.agent.registerOutboundTransport(new HttpOutboundTransport());
  }

  public get config(): InitConfig {
    const { name, walletId, walletKey, host, peerPort, path } =
      this.configService.get('agent');

    const endpoints = [`${host}${peerPort}${path}`];

    return {
      label: name,
      walletConfig: {
        id: walletId,
        key: walletKey,
      },
      endpoints,
      logger: new AgentLogger(LogLevel.warn),
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
        ],
        registrars: [new PeerDidRegistrar(), new KeyDidRegistrar()],
      }),

      askar: new AskarModule({ ariesAskar }),
    };
  }

  public get ledgers() {
    const ledgerIds = this.configService.get('agent.ledgerIds');

    if (!ledgerIds || ledgerIds.length < 1 || ledgerIds[0] === '') {
      throw new Error(
        'Agent could not start, please provide a ledger environment variable.',
      );
    }

    return ledgerIds.map((id: LedgerIds) => {
      const ledgerId: LedgerIds = id;

      if (!LEDGER_GENESIS?.[ledgerId]) {
        throw new Error(
          `No pool transaction genesis provided for ledger ${ledgerId}`,
        );
      }

      const ledger: IndyVdrPoolConfig = {
        indyNamespace: ledgerNamespaces[ledgerId],
        genesisTransactions: LEDGER_GENESIS?.[ledgerId],
        isProduction: false,
      };

      return ledger;
    });
  }

  private async registerPublicDid() {
    const { publicDidSeed, ledgerIds } = this.configService.get('agent');

    if (!publicDidSeed) {
      logger.info('No public did seed provided, skipping registration');
    }

    if (!ledgerIds || ledgerIds.length < 1 || ledgerIds[0] === '') {
      throw new Error(
        'Agent could not start, please provide a ledger environment variable.',
      );
    }

    const registeredPublicDidResponses = await registerPublicDids({
      alias: this.config.label,
      ledgerIds,
      seed: publicDidSeed,
    });

    for (const publicDidResponse of registeredPublicDidResponses) {
      await this.agent.dids.import({
        overwrite: true,
        did: publicDidResponse.did,
        privateKeys: [
          {
            keyType: KeyType.Ed25519,
            privateKey: TypedArrayEncoder.fromString(publicDidSeed),
          },
        ],
      });
    }
  }

  public async onModuleInit() {
    await this.agent.initialize();
    await this.registerPublicDid();
    logger.info('Agent initialized');
  }

  public async onModuleDestory() {
    await this.agent.shutdown();
  }
}
