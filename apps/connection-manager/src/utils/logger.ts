import type { Logger } from 'winston';

import { ecsFormat } from '@elastic/ecs-winston-format';
import { mkdirSync } from 'node:fs';
import winston from 'winston';

import { LoggerConfig } from '../common/constants.js';

mkdirSync(LoggerConfig.lOG_DIR, { recursive: true });

const logger: Logger = winston.createLogger({
  format: ecsFormat({ convertReqRes: true }),

  transports: [new winston.transports.Console()],
});

logger.on('error', (error) => {
  console.error('Error in logger caught', error);
});

export default logger;
