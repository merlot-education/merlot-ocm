import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import RestClientService from '../../client/rest.client.js';
import PrismaService from '../../prisma/prisma.service.js';
import SchemaDto from '../../schemas/entities/schema-entity.js';
import SchemasService from '../../schemas/services/service.js';
import logger from '../../utils/logger.js';
import pagination from '../../utils/pagination.js';
import CredentialDefDto from '../entities/credentialDef-entity.js';
import CredentialDefLedgerDto from '../entities/credentialDefLedger-entity.js';
import CredentialDefRepository from '../repository/credentialDef.respository.js';
import CredentialTypeRepository from '../../issue-credential/repository/credentialType.repository.js';

@Injectable()
export default class CredentialDefService {
  private credentialDefRepository: CredentialDefRepository;

  private credentialTypeRepository: CredentialTypeRepository;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly restClient: RestClientService,
    private readonly configService: ConfigService,
    private readonly schemaService: SchemasService,
  ) {
    this.credentialDefRepository = new CredentialDefRepository(
      this.prismaService,
    );

    this.credentialTypeRepository = new CredentialTypeRepository(
      this.prismaService,
    );
  }

  async createCredDef(credentialDefDtoPar: CredentialDefDto) {
    const credentialDefDto: CredentialDefDto = credentialDefDtoPar;
    const schema = await this.schemaService.findBySchemaId(
      credentialDefDto.schemaID,
    );
    logger.info(`is schema already exists ${schema}`);
    if (!schema) {
      const schemaLedger =
        await this.schemaService.getSchemaAndAttributesBySchemaIDFromLedger(
          credentialDefDto.schemaID,
        );
      const schemaObj: SchemaDto = {
        schemaID: credentialDefDto.schemaID,
        name: schemaLedger.name,
        version: schemaLedger.version,
        attributes: schemaLedger.attrNames,
        createdBy: '',
        id: '',
        type: '',
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      const createschema = await this.schemaService.createSchemas(schemaObj);
      logger.info(`Schema created in Database ${JSON.stringify(createschema)}`);
    }

    if (
      credentialDefDto.type &&
      typeof credentialDefDto.type === 'string' &&
      credentialDefDto.type.trim().length > 0
    ) {
      await this.credentialTypeRepository.createOrUpdateCredentialsType({
        schemaId: credentialDefDto.schemaID,
        type: credentialDefDto.type.trim(),
      });
    }
    delete credentialDefDto.type;
    return this.credentialDefRepository.createCredDef(credentialDefDto);
  }

  async findCredentialDef(pageSize: number, page: number, getSchemaID: string) {
    let query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.CredentialDefWhereUniqueInput;
      where?: Prisma.CredentialDefWhereInput;
      orderBy?: Prisma.CredentialDefOrderByWithRelationInput;
    } = {};
    if (getSchemaID) {
      query.where = {
        schemaID: getSchemaID,
      };
    }
    query = { ...query, ...pagination(pageSize, page) };
    return this.credentialDefRepository.findCredentialDef(query);
  }

  async findCredentialDefBySchemaIdAndCredDefId(data: {
    schemaID: string;
    credDefId: string;
  }) {
    return this.credentialDefRepository.findCredentialDef({
      where: data,
    });
  }

  async findCredentialDefBySchemaIdDesc(data: { schemaID: string }) {
    return this.credentialDefRepository.findCredentialDef({
      where: data,
      orderBy: {
        createdDate: 'desc',
      },
    });
  }

  async findCredentialDefById(id: string) {
    return this.credentialDefRepository.findCredentialDef({
      where: { credDefId: id },
    });
  }

  async checkCredDefByNameAndSchemaID(createSchema: CredentialDefDto) {
    return this.credentialDefRepository.findCredentialDef({
      where: {
        schemaID: {
          equals: createSchema.schemaID, // Default value: default
        },
        name: {
          equals: createSchema.name, // Default mode
        },
      },
    });
  }

  async createCredDefOnLedger(credentialDefDto: CredentialDefLedgerDto) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    return this.restClient.post(
      `${agentUrl}/credential-definitions/`,
      credentialDefDto,
    );
  }
}
