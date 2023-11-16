import { ecsFormat } from '@elastic/ecs-winston-format';
import { existsSync, mkdirSync } from 'fs';
import winston, { Logger } from 'winston';
import { LoggerConfig } from '../common/constants.js';

if (!existsSync(LoggerConfig.lOG_DIR)) {
  mkdirSync(LoggerConfig.lOG_DIR);
}

const logger: Logger = winston.createLogger({
  format: ecsFormat({ convertReqRes: true }),

  transports: [new winston.transports.Console()],
});

logger.on('error', (error) => {
  console.error('Error in logger caught', error);
});

export default logger;
