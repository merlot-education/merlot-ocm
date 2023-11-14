import { Controller, Get, HttpStatus, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseType } from '../common/response.js';

@Controller('health')
export default class HealthController {
  res: ResponseType;

  @Version(['1'])
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'This call provides the capability to check the service is working and up. The call returns 200 Status Code and current server time in json body',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is up and running.',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Service is up and running.': {
            value: {
              statusCode: 200,
              message:
                'Thu Jan 01 1970 00:00:00 GMT+0000 (Coordinated Universal Time)',
            },
          },
        },
      },
    },
  })
  getHealth() {
    this.res = {
      statusCode: HttpStatus.OK,
      message: `${new Date()}`,
    };
    return this.res;
  }
}
