import {
  All,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { ResponseType } from '@common/response';
import { AGENT } from '@agent/module';
import logger from '@src/globalUtils/logger';
import { Agent } from '@aries-framework/core';
import { GenericBody } from '@didComm/entities/GenericBody';
import { GenericParams } from '../utils/whitelist';
import { objectPathLoop } from '../didCommUtils';
import { prepareInputData, prepareOutputData } from '../utils/prepareData';

@Controller('agent')
export class DidCommController {
  constructor(@Inject(AGENT) private readonly agent: Agent) {}

  /**
   * A backup endpoint that dynamically interfaces with the agent, in case the extension
   * lags behind the AFJ or malfunctions
   *
   * expected body:
   *   {
   *     "subMethod": {
   *       "name": "asdas.asdasd",
   *       "subMethodData": [
   *         "argument1",
   *         "argument2"
   *       ]
   *     },
   *     "data": [
   *       "argumentN",
   *       "argumentN+1"
   *     ]
   *   }
   * @param params -one of the allowed properties/method to be called on the agent
   * @param body -arguments of the method and/or calling a method on the returned object
   */
  @All('/:property/:method')
  async generic(@Param() params: GenericParams, @Body() body: GenericBody) {
    logger.info(
      `Received request ${params.property}/${params.method}, body: ${JSON.stringify(body)}`,
    );
    const { property, method } = params;

    const prop: any = this.agent[property];

    // eslint-disable-next-line prefer-spread
    let response = await prop[method].apply(prop, prepareInputData(body.data));

    if (body.subMethod && body.subMethod.name) {
      const path = body.subMethod.name.split('.');
      let result: any;

      if (Array.isArray(response)) {
        const results = [];
        for (let j = 0; j < response.length; j += 1) {
          const prevContext = response[j];
          const context = response[j][path[0]];

          result = objectPathLoop(response, path, context, prevContext, body);

          results.push(prepareOutputData(result));
        }

        return {
          statusCode: HttpStatus.OK,
          message: `${property}.${method}(${JSON.stringify(body.data)}) => ${
            body.subMethod.name
          }`,
          data: results,
        } as ResponseType;
      }

      const prevContext = response;
      const context = response[path[0]];

      response = objectPathLoop(response, path, context, prevContext, body);
    }

    return {
      statusCode: HttpStatus.OK,
      message: `${property}.${method}(${JSON.stringify(body.data)}) => ${
        body.subMethod && body.subMethod.name && body.subMethod.name
      }`,
      data: prepareOutputData(response),
    } as ResponseType;
  }

  @Get('info')
  async getWalletInfo() {
    const { publicDid } = this.agent.wallet;
    if (!publicDid) {
      throw new Error('Wallet is not initialized');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: publicDid,
    } as ResponseType;
  }
}

export default DidCommController;
