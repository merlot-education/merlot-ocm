import { Controller, Get, Version, HttpStatus } from '@nestjs/common';
import type ResponseType from '../common/response.js';

@Controller('health')
export default class HealthController {
  res: ResponseType;

  @Version(['1'])
  @Get()
  getHealth() {
    this.res = {
      statusCode: HttpStatus.OK,
      message: `${new Date()}`,
    };
    return this.res;
  }
}
