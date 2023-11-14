import { Injectable } from '@nestjs/common';
import PrismaService from '../../prisma/prisma.service.js';
import logger from '../../utils/logger.js';
import UpdateUserInfoDto from '../entities/update-unserInfo.dto.js';
import UserInfoDto from '../entities/userInfo.entity.js';
import UserInfoRepository from '../repository/userInfo.respository.js';

@Injectable()
export default class UserInfoService {
  private userInfoRepository: UserInfoRepository;

  constructor(private readonly prismaService: PrismaService) {
    this.userInfoRepository = new UserInfoRepository(this.prismaService);
  }

  async createUserInfo(userInfoDto: UserInfoDto) {
    logger.info(`In user info service, ${JSON.stringify(userInfoDto)}`);
    return this.userInfoRepository.createUserInfo({
      autoAcceptCredential: userInfoDto.autoAcceptCredential,
      connectionId: userInfoDto.connectionId,
      userInfo: userInfoDto.userInfo as object,
    });
  }

  async updateUserInfo(userInfoDto: UpdateUserInfoDto) {
    logger.info(`In user info service, ${userInfoDto}`);
    return this.userInfoRepository.updateUserInfo({
      connectionId: userInfoDto.connectionId,
      credentialDefinitionId: userInfoDto.credentialDefinitionId,
      status: userInfoDto.status,
      userInfo: userInfoDto.userInfo as object,
    });
  }

  async getUserInfo(connectionId: string) {
    logger.info(`In get user info service, ${connectionId}`);
    return this.userInfoRepository.getUserInfo({
      where: {
        connectionId,
      },
    });
  }
}
