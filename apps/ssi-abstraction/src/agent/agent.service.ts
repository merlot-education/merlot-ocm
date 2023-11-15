import {
  Agent,
  ConnectionsModule,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
  KeyDidRegistrar,
  KeyDidResolver,
  KeyType,
  LogLevel,
  PeerDidRegistrar,
  PeerDidResolver,
  TypedArrayEncoder,
} from '@aries-framework/core';
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsClientService } from '@src/client/nats.client';
import logger from '@src/globalUtils/logger';
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { AnonCredsModule } from '@aries-framework/anoncreds';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { AskarModule } from '@aries-framework/askar';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  IndyVdrPoolConfig,
  IndyVdrSovDidResolver,
} from '@aries-framework/indy-vdr';
import { subscribe } from './utils/listener';
import {
  LedgerIds,
  ledgerNamespaces,
  LEDGER_GENESIS,
} from './utils/ledgerConfig';
import { AgentLogger } from './utils/logger';
import { registerPublicDids } from './ledger/register';

@Injectable()
export class AgentService {
  private agent: Agent<this['modules']>;

  private configService: ConfigService;

  private natsClient: NatsClientService;

  public constructor(
    configService: ConfigService,
    natsClient: NatsClientService,
  ) {
    this.configService = configService;
    this.natsClient = natsClient;

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

    // eslint-disable-next-line no-restricted-syntax
    for (const publicDidResponse of registeredPublicDidResponses) {
      // eslint-disable-next-line no-await-in-loop
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
    subscribe(this.agent, this.natsClient);
    logger.info('Agent initialized');
  }

  public async onModuleDestory() {
    await this.agent.shutdown();
  }
}

export default AgentService;
