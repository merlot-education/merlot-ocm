import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, NextFunction, Response } from 'express';

/**
 * Middleware that checks validity of provided params and body
 * to the requests.
 */
@Injectable()
export class AgentMid implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const [, prop] = req.url.split('/');
    if (prop === 'info') {
      next();
      return;
    }

    // const whiteListErrors = checkAll(prop, method, req.body);
    // if (whiteListErrors && !whiteListErrors.success) {
    //   res.send({
    //     statusCode: HttpStatus.BAD_REQUEST,
    //     error: whiteListErrors.messages,
    //   });
    //   res.end();
    //   return;
    // }

    if (req.body.subMethod && !req.body.subMethod.name) {
      res.send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'subMethod.name has to be specified',
      });
      res.end();
      return;
    }

    next();
  }
}

export default { AgentMid };
