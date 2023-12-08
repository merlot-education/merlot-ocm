import type { HealthIndicatorFunction } from '@nestjs/terminus';

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(
    private readonly config: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    const healthIndicators: HealthIndicatorFunction[] = [];

    const natsMonitoringUrl = this.config.get('nats.monitoringUrl');
    if (typeof natsMonitoringUrl === 'string') {
      healthIndicators.push(() =>
        this.http.pingCheck('nats', natsMonitoringUrl),
      );
    } else {
      healthIndicators.push(() => ({ nats: { status: 'down' } }));
    }

    return this.health.check(healthIndicators);
  }
}
