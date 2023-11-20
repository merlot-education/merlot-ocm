import winston, { Logger } from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';

export const logger: Logger = winston.createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [new winston.transports.Console()],
});

logger.on('error', (error: Error) => {
  console.error('Error in logger caught', error);
});
