import { ecsFormat } from '@elastic/ecs-winston-format';
import { createLogger, transports, type Logger } from 'winston';

const logger: Logger = createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

logger.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error('Error in logger caught', error);
});

export default logger;
