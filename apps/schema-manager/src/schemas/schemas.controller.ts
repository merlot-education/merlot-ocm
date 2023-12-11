import type {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
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
import { Observable, of, switchMap } from 'rxjs';

import { GetByIdParams } from './dto/get-by-id.dto.js';
import { RegisterSchemaPayload } from './dto/register-schema.dto.js';
import { TenantIdParam } from './dto/tenant-id.dto.js';
import { SchemasService } from './schemas.service.js';

@Controller('schemas')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@ApiTags('Schemas')
export class SchemasController {
  public constructor(private readonly schemasService: SchemasService) {}

  @Version('1')
  @Get()
  @ApiOperation({
    summary: 'Fetch a list of schemas',
    description: 'This call provides a list of schemas for a given tenant',
  })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schemas fetched successfully',
    content: {
      // TBD
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
    content: {
      // TBD
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    content: {
      // TBD
    },
  })
  public getAll(
    @Query() { tenantId }: TenantIdParam,
  ): Observable<EventAnonCredsSchemasGetAll['data']> {
    return this.schemasService.getAll({
      tenantId,
    });
  }

  @Version('1')
  @Get(':schemaId')
  @ApiOperation({
    summary: 'Fetch a schema by id',
    description:
      'This call allows you to retrieve schema data for a given tenant by specifying the `schemaId`.',
  })
  @ApiParam({ name: 'schemaId', required: true })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schema fetched successfully',
    content: {
      // TBD
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
    content: {
      // TBD
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schema not found',
    content: {
      // TBD
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    content: {
      // TBD
    },
  })
  public getById(
    @Param() { schemaId }: GetByIdParams,
    @Query() { tenantId }: TenantIdParam,
  ): Observable<EventAnonCredsSchemasGetById['data']> {
    return this.schemasService
      .getById({
        tenantId,
        schemaId,
      })
      .pipe(
        switchMap((schema) => {
          if (schema === null) {
            throw new NotFoundException(`Schema with id ${schemaId} not found`);
          }
          return of(schema);
        }),
      );
  }

  @Version('1')
  @Post()
  @ApiOperation({
    summary: 'Register a new schema',
    description:
      'This call provides the capability to create new schema on ledger by name, author, version, schema attributes and type. Later this schema can be used to issue new credential definition. This call returns an information about created schema.',
  })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiBody({ type: RegisterSchemaPayload })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Schema registered successfully',
    content: {
      'application/json': {},
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
    content: {
      'application/json': {},
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'All fields are required for schema registration',
    content: {
      'application/json': {},
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Schema already exists',
    content: {
      'application/json': {},
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    content: {
      'application/json': {},
    },
  })
  public register(
    @Query() { tenantId }: TenantIdParam,
    @Body() payload: RegisterSchemaPayload,
  ): Observable<EventAnonCredsSchemasRegister['data']> {
    return this.schemasService.register({
      ...payload,
      tenantId,
    });
  }
}
