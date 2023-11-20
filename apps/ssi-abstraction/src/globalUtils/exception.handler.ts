import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseType } from '../common/response.js';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Custom exception handler
   *
   * @param exception - error
   * @param host - the execution context for exceptions
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Something went wrong!';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }

    const responseBody: ResponseType = {
      statusCode,
      message,
      error: exception.message,
    };

    httpAdapter.reply(response, responseBody, statusCode);
  }
}

export default ExceptionHandler;
