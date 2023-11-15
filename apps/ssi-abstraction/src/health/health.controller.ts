import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  /**
   * Check if app is running
   *
   * @returns - OK (200) if app is running
   */
  // eslint-disable-next-line class-methods-use-this
  @Get()
  getHealth() {
    return {
      statusCode: HttpStatus.OK,
      message: `${new Date()}`,
    };
  }
}

export default HealthController;
