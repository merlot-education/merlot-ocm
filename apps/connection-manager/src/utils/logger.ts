import { existsSync, mkdirSync } from 'fs';
import winston, { Logger } from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import { LoggerConfig } from '@common/constants';

if (!existsSync(LoggerConfig.lOG_DIR)) {
  mkdirSync(LoggerConfig.lOG_DIR);
}

// const esTransportOpts = {
//   clientOpts: { node: process.env.ECSURL },
// };

// const esTransport = new ElasticsearchTransport(esTransportOpts);

// esTransport.on('error', (error) => {
//   console.error(error);
// });

const logger: Logger = winston.createLogger({
  format: ecsFormat({ convertReqRes: true }),

  transports: [
    new winston.transports.Console(),

    // new winston.transports.File({
    //   // path to log file
    //   filename: LoggerConfig.FILE_PATH,
    // }),
    // // Path to Elasticsearch
    // esTransport,
  ],
});

logger.on('error', (error) => {
  console.error('Error in logger caught', error);
});

export default logger;
