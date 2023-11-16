import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Version, // Post, Version, Body, Res, Req,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { isURL } from 'class-validator';
import type { Request, Response } from 'express';
import { NATSServices } from '../../common/constants.js';
import type ResponseType from '../../common/response.js';
import logger from '../../utils/logger.js';
import MapUserInfoDTO from '../entities/mapUserInfoDTO.entity.js';
import OfferMembershipCredentialDto from '../entities/offerMembershipCredentialDto.entity.js';
import PrincipalService from '../services/service.js';

@Controller()
export default class PrincipalController {
  name: string;

  constructor(private readonly principalService: PrincipalService) {}

  @MessagePattern({
    endpoint: `${NATSServices.SERVICE_NAME}/connectionCompleteStatus`,
  })
  async connectionComplete(data: OfferMembershipCredentialDto) {
    logger.info(
      `call from connection manager for  OfferMembershipCredentialDto ${OfferMembershipCredentialDto}`,
    );
    let response: ResponseType = {
      statusCode: HttpStatus.OK,
      message: 'Status connection received',
    };
    if (data.status.toUpperCase() === 'COMPLETE') {
      this.principalService.OfferMembershipCredential(data);
      return response;
    }

    response = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Connection status should be Complete',
    };
    return response;
  }

  @Version(['1'])
  @Post('map-user-info')
  async mapUserInfo(
    @Body() tokenBody: MapUserInfoDTO,
    @Res() response: Response,
    @Req() req: Request, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    try {
      const { userInfoURL, userData } = tokenBody;

      if (
        (!userData ||
          typeof userData !== 'object' ||
          Object.keys(userData).length === 0) &&
        (!userInfoURL || !isURL(userInfoURL))
      ) {
        throw new BadRequestException('Invalid user data or user info url');
      }

      const res = {
        statusCode: HttpStatus.CREATED,
        message: 'User info mapped successfully',
        data: await this.principalService.mapUserInfo(tokenBody),
      };

      return response.send(res);
    } catch (error: unknown) {
      throw new HttpException(
        Reflect.get(error || {}, 'message') || 'Internal server error',
        Reflect.get(error || {}, 'status') || 500,
      );
    }
  }

  // listen for complete connection event and filter based
  // on matching connection ids from database that have userInfo
  // once COMPLETE:
  // * map userInfo to VC
  // * issue VC to did of matching complete connection ID
  // * if (issuing successful) delete record from DB
}
