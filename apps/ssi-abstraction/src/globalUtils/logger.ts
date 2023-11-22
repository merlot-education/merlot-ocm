import type { Logger } from 'winston';

import { ecsFormat } from '@elastic/ecs-winston-format';
import { createLogger, transports } from 'winston';

export const logger: Logger = createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

logger.on('error', (error: Error) => {
  // eslint-disable-next-line no-console
  console.error('Error in logger caught', error);
});
