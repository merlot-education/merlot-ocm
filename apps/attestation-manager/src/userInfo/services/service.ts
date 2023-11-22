import type UpdateUserInfoDto from '../entities/update-unserInfo.dto.js';
import type UserInfoDto from '../entities/userInfo.entity.js';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';
import logger from '../../utils/logger.js';
import UserInfoRepository from '../repository/userInfo.respository.js';

@Injectable()
export default class UserInfoService {
  private userInfoRepository: UserInfoRepository;

  public constructor(private readonly prismaService: PrismaService) {
    this.userInfoRepository = new UserInfoRepository(this.prismaService);
  }

  public async createUserInfo(userInfoDto: UserInfoDto) {
    logger.info(`In user info service, ${JSON.stringify(userInfoDto)}`);
    return this.userInfoRepository.createUserInfo({
      autoAcceptCredential: userInfoDto.autoAcceptCredential,
      connectionId: userInfoDto.connectionId,
      userInfo: userInfoDto.userInfo as object,
    });
  }

  public async updateUserInfo(userInfoDto: UpdateUserInfoDto) {
    logger.info(`In user info service, ${userInfoDto}`);
    return this.userInfoRepository.updateUserInfo({
      connectionId: userInfoDto.connectionId,
      credentialDefinitionId: userInfoDto.credentialDefinitionId,
      status: userInfoDto.status,
      userInfo: userInfoDto.userInfo as object,
    });
  }

  public async getUserInfo(connectionId: string) {
    logger.info(`In get user info service, ${connectionId}`);
    return this.userInfoRepository.getUserInfo({
      where: {
        connectionId,
      },
    });
  }
}
