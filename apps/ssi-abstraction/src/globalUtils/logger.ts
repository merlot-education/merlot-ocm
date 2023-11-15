import winston, { Logger } from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';

// import { ElasticsearchTransport } from 'winston-elasticsearch';
// const esTransportOpts = {
//   clientOpts: { node: process.env.ECSURL },
// };
//
// const esTransport = new ElasticsearchTransport(esTransportOpts);
//
// esTransport.on('error', (error: any) => {
//   console.error('Error in logger caught', error);
// });

const logger: Logger = winston.createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.Console(),
    // esTransport,
  ],
});

logger.on('error', (error: Error) => {
  // eslint-disable-next-line no-console
  console.error('Error in logger caught', error);
});

export default logger;
