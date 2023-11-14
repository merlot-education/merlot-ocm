import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import { VersionRegex } from '../../common/constants.js';
import { ResponseType } from '../../common/response.js';
import logger from '../../utils/logger.js';
import SchemaDto from '../entities/schema-entity.js';
import SchemasService from '../services/service.js';

@ApiTags('Schemas')
@Controller('schemas')
export default class SchemasController {
  constructor(private readonly schemasService: SchemasService) {}

  @Version(['1'])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @Get('')
  @ApiOperation({
    summary: 'Fetch a list of schemas',
    description:
      'This call provides capabilities to search schemas (which have been created by this OCM) by using pagination. This call returns a list of schemas and overall count of records. Every record contains schemaId, name, attributes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schemas fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schemas fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Schemas fetched successfully',
              data: {
                count: 2,
                records: [
                  {
                    id: '1234abcd',
                    schemaID: 'loremipsum:test-01-01:1.0',
                    name: 'test-01-01',
                    createdBy: 'agentName',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
                    attribute: [
                      {
                        name: 'attribute1',
                      },
                      {
                        name: 'attribute2',
                      },
                      {
                        name: 'attributeN',
                      },
                    ],
                  },
                  {
                    id: '5678abcd',
                    schemaID: 'loremipsum2:test2-01-01:1.0',
                    name: 'test2-01-01',
                    createdBy: 'agentName',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
                    attribute: [
                      {
                        name: 'attribute1',
                      },
                      {
                        name: 'attribute2',
                      },
                      {
                        name: 'attributeN',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Data found.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found.': {
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async findSchemas(
    @Query() query: { pageSize: string; page: string },
    @Res() response: Response,
  ) {
    let res: ResponseType;
    try {
      logger.info('Schemas fetch successfully');
      const result = await this.schemasService.findSchemas(
        query.pageSize ? parseInt(query.pageSize, 10) : 10,
        query.page ? parseInt(query.page, 10) : 0,
      );
      if (result) {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Schemas fetched successfully',
          data: {
            count: result[0],
            records: result[1],
          },
        };
      } else {
        response.status(HttpStatus.NOT_FOUND);
        res = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Data found',
        };
      }
      return response.send(res);
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Internal Server Error: ${Reflect.get(error || {}, 'message')}`,
      );
    }
  }

  @ApiParam({ name: 'id', type: 'string', description: 'Pass schema id' })
  @Version(['1'])
  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch schema by id',
    description:
      'This call provides the capability to get schema data by providing schemaId. The schema data is the same which is returned from /v1/schemas endpoint and contains generic information about schema like schemaID, name, createdBy, createdDate, updatedBy, updatedDate, attribute',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schema fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Schema fetched successfully',
              data: {
                count: 1,
                records: [
                  {
                    id: '1234abcd',
                    schemaID: 'loremipsum:test-01-01:1.0',
                    name: 'test-01-01',
                    createdBy: 'agentName',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
                    attribute: [
                      {
                        name: 'attribute1',
                      },
                      {
                        name: 'attribute2',
                      },
                      {
                        name: 'attributeN',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Data found.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found.': {
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async findSchemasById(@Param('id') id: string, @Res() response: Response) {
    let res: ResponseType;
    try {
      logger.info('Schema fetched successfully');
      const result = await this.schemasService.findSchemasById(id);
      if (Array.isArray(result) && result[0] > 0) {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Schema fetch successfully',
          data: {
            count: result[0],
            records: result[1],
          },
        };
      } else {
        response.status(HttpStatus.NOT_FOUND);
        res = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Data found',
        };
      }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Version(['1'])
  @ApiBody({ type: SchemaDto })
  @Post('')
  @ApiOperation({
    summary: 'Create a new schema',
    description:
      'This call provides the capability to create new schema on ledger by name, author, version, schema attributes and type. Later this schema can be used to issue new credential definition. This call returns an information about created schema.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Schema created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema created successfully': {
            value: {
              statusCode: 201,
              message: 'Schema created successfully',
              data: {
                id: '1234qwer',
                schemaID: 'loremipsum:2:test-02-01:1.0',
                name: 'test-02-01',
                createdBy: 'agentName',
                createdDate: '1970-01-01T00:00:28.343Z',
                updatedBy: '',
                updatedDate: '1970-01-01T00:00:28.343Z',
                attribute: [
                  {
                    name: 'attribute1',
                  },
                  {
                    name: 'attribute2',
                  },
                  {
                    name: 'attributeN',
                  },
                  {
                    name: 'attributeN+1',
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Schema required following attributes ( name, createdBy, version, attributes )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema required following attributes ( name, createdBy, version, attributes )':
            {
              value: {
                statusCode: 400,
                message:
                  'Schema required following attributes ( name, createdBy, version, attributes )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Could not get agent details. please try again.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Could not get agent details. please try again.': {
            value: {
              statusCode: 400,
              message: 'Could not get agent details. please try again.',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Schema already exists',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema already exists': {
            value: {
              statusCode: 409,
              message: 'Schema already exists',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async createSchema(
    @Body() createSchema: SchemaDto,
    @Res() response: Response,
  ) {
    try {
      let res: ResponseType;
      if (
        !(
          createSchema.name &&
          typeof createSchema.name === 'string' &&
          createSchema.createdBy &&
          typeof createSchema.createdBy === 'string' &&
          createSchema.version &&
          typeof createSchema.version === 'string' &&
          VersionRegex.test(createSchema.version) &&
          Array.isArray(createSchema.attributes) &&
          createSchema.attributes.length > 0 &&
          createSchema.attributes.every(
            (i) => typeof i === 'string' && i.trim().length > 0,
          )
        )
      ) {
        res = {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Schema required following attributes ( name, createdBy, version, attributes )',
        };
        return response.status(HttpStatus.BAD_REQUEST).send(res);
      }
      createSchema.attributes.push('expirationDate');
      const schemaResponse =
        await this.schemasService.checkSchemasByNameAndVersion(createSchema);
      if (schemaResponse[0] === 0) {
        const resp =
          await this.schemasService.createSchemaOnLedger(createSchema);
        if (resp?.id) {
          const schemaRes: SchemaDto = createSchema;
          schemaRes.schemaID = resp.id;
          response.status(HttpStatus.CREATED);
          res = {
            statusCode: HttpStatus.CREATED,
            message: 'Schema created successfully',
            data: await this.schemasService.createSchemas(schemaRes),
          };
          logger.info('Schema created successfully');
        } else {
          response.status(HttpStatus.BAD_REQUEST);
          res = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Could not get agent details. please try again.',
          };
        }
      } else {
        response.status(HttpStatus.CONFLICT);
        res = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Schema already exists',
        };
      }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  @Version(['1'])
  @Get('/get-dids-for-schema/:id')
  @ApiOperation({
    summary: 'Fetch list of dids for schema id',
    description:
      'This call provides the capability to get principal dids. The format of the response is shown in the example. To issue credentials, you need to have a credential definition. This is a basic principle of this process. This credential definition is created by using the schema. Using this endpoint gives you all dids of participants to whom OCM issued credentials using specified schema.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schema DIDs fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema DIDs fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Schema DIDs fetched successfully',
              data: {
                total_credential_defs: 1,
                principalDids: [
                  {
                    loremIpsumCredDef: ['1234did'],
                  },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Data found.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found.': {
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'No Data found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal Server Error.': {
            value: {
              statusCode: 500,
              timestamp: '1970-01-01T00:00:27.897Z',
              message: 'Lorem Ipsum',
            },
          },
        },
      },
    },
  })
  async getDidsForSchema(@Param('id') id: string, @Res() response: Response) {
    let res: ResponseType;
    try {
      logger.info('Schema DIDs fetched successfully');
      const result = await this.schemasService.getDidsForSchemasId(id);

      if (result && result.length) {
        const schema = result[0];
        const credDefs = schema.credential_defs;
        const principalDids = credDefs.map((cd) => ({
          [cd.credDefId]: cd.credentials.map((cred) => cred.principalDid),
        }));

        const data = {
          total_credential_defs: credDefs.length,
          principalDids,
        };

        res = {
          statusCode: HttpStatus.OK,
          message: 'Schema DIDs fetched successfully',
          data,
        };
      } else {
        response.status(HttpStatus.NOT_FOUND);
        res = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Data found',
        };
      }
      return response.send(res);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
