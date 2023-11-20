import type SchemaDto from '../entities/schema-entity.js';
import type { Prisma } from '@prisma/client';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import NatsClientService from '../../client/nats.client.js';
import RestClientService from '../../client/rest.client.js';
import CredentialTypeRepository from '../../issue-credential/repository/credentialType.repository.js';
import PrismaService from '../../prisma/prisma.service.js';
import pagination from '../../utils/pagination.js';
import SchemaRepository from '../repository/schema.respository.js';

@Injectable()
export default class SchemasService {
  private schemaRepository: SchemaRepository;

  private credentialTypeRepository: CredentialTypeRepository;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly restClient: RestClientService,
    private readonly natsClient: NatsClientService,
    private readonly configService: ConfigService,
  ) {
    this.schemaRepository = new SchemaRepository(this.prismaService);
    this.credentialTypeRepository = new CredentialTypeRepository(
      this.prismaService,
    );
  }

  public async createSchemas(schema: SchemaDto) {
    const query: {
      schemaID: string;
      name: string;
      createdBy: string;
      attribute: {
        create: {
          schemaID: string;
          name: string;
          createdBy: string;
        }[];
      };
    } = {
      schemaID: schema.schemaID,
      name: schema.name,
      createdBy: schema.createdBy,
      attribute: {
        create: [],
      },
    };
    schema.attributes.forEach((element) => {
      query.attribute.create.push({
        schemaID: schema.schemaID,
        name: element,
        createdBy: schema.createdBy,
      });
    });

    if (
      schema.type &&
      typeof schema.type === 'string' &&
      schema.type.trim().length > 0
    ) {
      await this.credentialTypeRepository.createOrUpdateCredentialsType({
        schemaId: query.schemaID,
        type: schema.type.trim(),
      });
    }

    return this.schemaRepository.createSchema(query);
  }

  public async findSchemas(pageSize: number, page: number) {
    let query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.SchemaWhereUniqueInput;
      where?: Prisma.SchemaWhereInput;
      orderBy?: Prisma.SchemaOrderByWithRelationInput;
    } = {};

    query = { ...query, ...pagination(pageSize, page) };
    return this.schemaRepository.findSchemas(query);
  }

  public async findSchemasById(id: string) {
    return this.schemaRepository.findSchemas({
      where: { schemaID: id },
    });
  }

  public async getDidsForSchemasId(id: string) {
    return this.prismaService.schema.findMany({
      where: { schemaID: id },
      include: {
        attribute: true,
        credential_defs: {
          include: {
            credentials: {
              distinct: 'principalDid',
            },
          },
        },
      },
    });
  }

  public findBySchemaId(schemaID: string) {
    const query = { where: { schemaID } };
    return this.schemaRepository.findUniqueSchema(query);
  }

  public async checkSchemasByNameAndVersion(schemaDto: SchemaDto) {
    return this.schemaRepository.findSchemas({
      where: {
        schemaID: {
          endsWith: `:${schemaDto.version}`,
          mode: 'insensitive', // Default value: default
        },
        name: {
          equals: schemaDto.name, // Default mode
        },
      },
    });
  }

  public async createSchemaOnLedger(schemaDto: SchemaDto) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.post(
      `${agentUrl}/schemas/`,
      schemaDto,
    );

    return responseData;
  }

  public async getSchemaAndAttributesBySchemaIDFromLedger(schemaID: string) {
    const agentUrl = this.configService.get('agent.AGENT_URL');
    const responseData = await this.restClient.get(
      `${agentUrl}/schemas/${schemaID}`,
    );

    if (!responseData?.id) {
      throw new BadRequestException('Invalid schema ID');
    }

    return responseData;
  }
}
