// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Response } from 'express';

import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';

import { AutoAcceptCredential } from '../../common/constants.js';
import logger from '../../utils/logger.js';
import UserInfoDto from '../entities/userInfo.entity.js';
import UserInfoService from '../services/service.js';

@ApiTags('userInfo (to be deprecated)')
@Controller('userInfo')
export default class UserInfoController {
  public constructor(private readonly userInfoService: UserInfoService) {}

  @Version(['1'])
  @ApiBody({ type: UserInfoDto })
  @Post('')
  @ApiOperation({
    summary: 'Add user information to a connection',
    description:
      'This call provides the capability to add any additional information to connection. The format of added data is just a simple json',
  })
  public async createUserInfo(
    @Body() userInfoDto: UserInfoDto,
    @Res() response: Response,
  ) {
    try {
      logger.info(`UserInfoDto: ${JSON.stringify(UserInfoDto)}`);

      const { autoAcceptCredential, connectionId, userInfo } = userInfoDto;

      if (!connectionId || !isUUID(connectionId)) {
        throw new BadRequestException('Invalid connection ID');
      }

      if (
        autoAcceptCredential &&
        autoAcceptCredential in AutoAcceptCredential
      ) {
        throw new BadRequestException('Invalid autoAcceptCredential');
      }

      if (!userInfo || Object.values(userInfo).length === 0) {
        throw new BadRequestException('Invalid userInfo');
      }

      const res = {
        statusCode: HttpStatus.CREATED,
        message: 'User info created successfully',
        data: await this.userInfoService.createUserInfo(userInfoDto),
      };
      return response.send(res);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new HttpException(
          Reflect.get(error || {}, 'message') || 'Internal server error',
          Reflect.get(error || {}, 'status') || 500,
        );
      }
    }
  }
}
