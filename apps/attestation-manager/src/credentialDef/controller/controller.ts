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
import { ResponseType } from '../../common/response.js';
import logger from '../../utils/logger.js';
import CredentialDefDto from '../entities/credentialDef-entity.js';
import CredentialDefLedgerDto from '../entities/credentialDefLedger-entity.js';
import CredentialDefService from '../services/service.js';

@ApiTags('Credential Definitions')
@Controller('credentialDef')
export default class CredentialDefController {
  constructor(private readonly credentialDefService: CredentialDefService) {}

  @Version(['1'])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'schemaID', required: false })
  @Get('')
  @ApiOperation({
    summary: 'Fetch a list of credential definitions',
    description:
      'This call provides the capability to search created credential definitions by using pagination and filter parameter (schemaID) to select credential definitions. This call returns a list of credential definitions and overall count of records. Using a credential definition from that list you can issue credential so some connection',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential definitions fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definitions fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential definitions fetched successfully',
              data: {
                count: 2,
                records: [
                  {
                    id: '1234abcd',
                    schemaID: 'loremipsum:test-01-01:1.0',
                    name: 'test-01-01',
                    credDefId: 'test-cred-def123',
                    isAutoIssue: false,
                    isRevokable: false,
                    expiryHours: '24',
                    createdBy: 'acceptsAnyString',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
                  },
                  {
                    id: '5678abcd',
                    schemaID: 'loremipsum2:test2-01-01:1.0',
                    name: 'test2-01-01',
                    credDefId: 'test2-cred-def123',
                    isAutoIssue: false,
                    isRevokable: false,
                    expiryHours: '24',
                    createdBy: 'acceptsAnyString',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
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
  async findCredentialDef(
    @Query()
    query: {
      pageSize: string;
      page: string;
      schemaID: string;
    },
    @Res() response: Response,
  ) {
    let res: ResponseType;
    try {
      logger.info('Credential definitions fetched successfully');
      const result = await this.credentialDefService.findCredentialDef(
        query.pageSize ? parseInt(query.pageSize, 10) : 10,
        query.page ? parseInt(query.page, 10) : 0,
        query.schemaID ? query.schemaID : '',
      );
      if (Array.isArray(result) && result[0] > 0) {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Credential definitions fetched successfully',
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
      logger.error(error instanceof Error && error.message);
      throw new InternalServerErrorException(
        `Error: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  @ApiParam({ name: 'id', type: 'string', description: 'Pass Cred Def id' })
  @Version(['1'])
  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch credential definition by id',
    description:
      'This call provides the capability to get credential definition data by providing id of credential definition. The credential definition data is the same which is returned from /v1/connections endpoint and contains generic information about credential definition like schemaID, name, credDefId, isAutoIssue, isRevokable, expiryHours, createdBy, createdDate, updatedBy, updatedDate',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential definition fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential definition fetched successfully',
              data: {
                count: 1,
                records: [
                  {
                    id: '1234abcd',
                    schemaID: 'loremipsum:test-01-01:1.0',
                    name: 'test-01-01',
                    credDefId: 'test-cred-def123',
                    isAutoIssue: false,
                    isRevokable: false,
                    expiryHours: '24',
                    createdBy: 'acceptsAnyString',
                    createdDate: '1970-01-01T00:00:28.343Z',
                    updatedBy: '',
                    updatedDate: '1970-01-01T00:00:28.343Z',
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
    description: 'No Data found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'No Data found': {
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
  async findCredentialDefById(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    let res: ResponseType;
    try {
      logger.info('Credential definition fetched successfully');
      const result = await this.credentialDefService.findCredentialDefById(id);
      if (Array.isArray(result) && result[0] > 0) {
        res = {
          statusCode: HttpStatus.OK,
          message: 'Credential definition fetch successfully',
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
  @ApiBody({ type: CredentialDefDto })
  @Post('')
  @ApiOperation({
    summary: 'Create a new credential definition',
    description:
      'This call provides the capability to create new credential definition by providing schema id, name, createdBy, auto-issue and other information required by this method. This call returns an object contains information abut this credential definition (type CredentialDefDto). You can use this credential definition to issue credentials to some connection',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential definition created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition created successfully': {
            value: {
              statusCode: 201,
              message: 'Credential definition created successfully',
              data: {
                id: '71b784a3',
                schemaID: '7KuDTpQh3:test-schema',
                name: 'test',
                credDefId: '7KuDTpQh3:test',
                isAutoIssue: false,
                isRevokable: false,
                expiryHours: '23',
                createdBy: 'vocm',
                createdDate: '1970-01-01T00:00:28.343Z',
                updatedBy: '',
                updatedDate: '1970-01-01T00:00:28.343Z',
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
      'Credential definition required following attributes ( schemaID, name, isRevokable, isAutoIssue, createdBy, expiryHours )',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition required following attributes ( schemaID, name, isRevokable, isAutoIssue, createdBy, expiryHours )':
            {
              value: {
                statusCode: 400,
                message:
                  'Credential definition required following attributes ( schemaID, name, isRevokable, isAutoIssue, createdBy, expiryHours )',
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Could not get credential definition details. Please try again.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Could not get credential definition details. Please try again.': {
            value: {
              statusCode: 400,
              message:
                'Could not get credential definition details. Please try again.',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Credential definition already exists',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition already exists': {
            value: {
              statusCode: 409,
              message: 'Credential definition already exists',
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
  async createCredentialDef(
    @Body() credentialDefDto: CredentialDefDto,
    @Res() response: Response,
  ) {
    try {
      let res: ResponseType = {
        statusCode: HttpStatus.OK,
        message: 'Something went wrong please try again.',
      };
      if (
        !(
          credentialDefDto.schemaID &&
          typeof credentialDefDto.schemaID === 'string' &&
          credentialDefDto.name &&
          typeof credentialDefDto.name === 'string' &&
          credentialDefDto.createdBy &&
          typeof credentialDefDto.createdBy === 'string' &&
          (credentialDefDto.isRevokable === false ||
            credentialDefDto.isRevokable === true) &&
          (credentialDefDto.isAutoIssue === false ||
            credentialDefDto.isAutoIssue === true) &&
          credentialDefDto.expiryHours &&
          typeof credentialDefDto.expiryHours === 'string' &&
          parseFloat(credentialDefDto.expiryHours) >= -1
        )
      ) {
        res = {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Credential definition required following attributes ( schemaID, name, isRevokable, isAutoIssue, createdBy, expiryHours )',
        };
        return response.status(HttpStatus.BAD_REQUEST).send(res);
      }
      const credDefResponse =
        await this.credentialDefService.checkCredDefByNameAndSchemaID(
          credentialDefDto,
        );

      if (credDefResponse[0] === 0) {
        const credentialDefLedgerDto: CredentialDefLedgerDto = {
          tag: credentialDefDto.name,
          supportRevocation: credentialDefDto.isRevokable,
          schemaId: credentialDefDto.schemaID,
        };
        const resp = await this.credentialDefService.createCredDefOnLedger(
          credentialDefLedgerDto,
        );

        if (resp?.id) {
          const credentialDefIDRes: CredentialDefDto = credentialDefDto;
          credentialDefIDRes.credDefId = resp.id;
          response.status(HttpStatus.CREATED);
          res = {
            statusCode: HttpStatus.CREATED,
            message: 'Credential definition created successfully',
            data: await this.credentialDefService.createCredDef(
              credentialDefIDRes,
            ),
          };
          logger.info('Credential definition created successfully');
        } else {
          response.status(HttpStatus.BAD_REQUEST);
          res = {
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Could not get credential definition details. Please try again.',
          };
        }
      } else {
        response.status(HttpStatus.CONFLICT);
        res = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Credential definition already exists',
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
