import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class UserInfoRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createUserInfo(data: Prisma.UserInfoCreateInput) {
    const userInfo = await this.prismaService.userInfo.create({
      data,
    });

    return userInfo;
  }

  public async updateUserInfo(data: Prisma.UserInfoUncheckedUpdateManyInput) {
    const userInfo = await this.prismaService.userInfo.updateMany({
      where: {
        connectionId: data.connectionId as string,
      },
      data,
    });

    return userInfo;
  }

  public async getUserInfo(params: { where: Prisma.UserInfoWhereInput }) {
    const { where } = params;
    return this.prismaService.userInfo.findFirst({
      where,
    });
  }
}
