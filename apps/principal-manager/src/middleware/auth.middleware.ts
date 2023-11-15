import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import logger from '../utils/logger.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.configService.get('auth.useAuth') === 'false') {
      return next();
    }

    logger.info('Request at middleware');

    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    if (!authToken) {
      logger.error('No access token provided.');
      res.json({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized. No Access token provided.',
        data: undefined,
      });
      return;
    }

    const getKey = (
      header: jwt.JwtHeader,
      callback: jwt.SigningKeyCallback,
    ): void => {
      const jwksUri = this.configService.get('auth.tokenUrl') || '';
      const client = jwksClient({ jwksUri, timeout: 30000 });

      client
        .getSigningKey(header.kid)
        .then((key) => callback(null, key.getPublicKey()))
        .catch(callback);
    };

    function verify(token: string): Promise<unknown> | undefined {
      return new Promise(
        (
          resolve: (decoded: unknown) => void,
          reject: (error: Error) => void,
        ) => {
          const verifyCallback: jwt.VerifyCallback<jwt.JwtPayload | string> = (
            error: jwt.VerifyErrors | null,
            decoded: unknown,
          ): void => {
            if (error) {
              return reject(error);
            }
            return resolve(decoded);
          };

          jwt.verify(token, getKey, verifyCallback);
        },
      );
    }

    const result = await verify(authToken);

    if (!result) {
      logger.error('Invalid access token provided.');
      res.json({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized. Invalid Access token provided.',
        data: undefined,
      });
      return;
    }

    next();
  }
  /* eslint-enable */
}

export default {
  AuthMiddleware,
};
