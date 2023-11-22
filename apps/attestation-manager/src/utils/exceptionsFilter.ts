import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request } from 'express';

import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

const { PrismaClientKnownRequestError, PrismaClientValidationError } = Prisma;

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';

    switch (exception.constructor) {
      case HttpException:
        httpStatus = (exception as HttpException).getStatus();
        message = exception?.message || 'Internal server error';
        break;
      case PrismaClientKnownRequestError:
        httpStatus = HttpStatus.BAD_REQUEST;
        message = exception?.message;
        break;
      case PrismaClientValidationError:
        httpStatus = HttpStatus.BAD_REQUEST;
        message = exception?.message;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception?.message || 'Internal server error';
    }

    Logger.error(
      'Exception Filter :',
      message,
      (exception as Error).stack,
      `${request.method} ${request.url}`,
    );

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
