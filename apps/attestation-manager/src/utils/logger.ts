import { ecsFormat } from '@elastic/ecs-winston-format';
import { mkdirSync } from 'fs';
import { createLogger, transports, type Logger } from 'winston';

import { LoggerConfig } from '../common/constants.js';

mkdirSync(LoggerConfig.lOG_DIR, { recursive: true });

const logger: Logger = createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: LoggerConfig.FILE_PATH,
    }),
    // esTransport,
  ],
});

logger.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error('Error in logger caught', error);
});

export default logger;
