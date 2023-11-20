import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class CredentialRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createCredential(data: Prisma.CredentialCreateInput) {
    const credential = await this.prismaService.credential.create({ data });

    const credDef = await this.prismaService.credentialDef.findFirst({
      where: { credDefId: data.credDefId },
    });

    if (!credDef) {
      return credential;
    }

    await this.prismaService.credentialDef.update({
      where: {
        credDefId: data.credDefId,
      },
      data: {
        credentials: {
          connect: {
            id: credential.id,
          },
        },
      },
    });

    return credential;
  }

  public async findUniqueCredential(params: {
    where: Prisma.CredentialWhereUniqueInput;
  }) {
    const { where } = params;
    return this.prismaService.credential.findUnique({
      where,
    });
  }

  public async updateCredential(params: {
    where: Prisma.CredentialWhereUniqueInput;
    data: Prisma.CredentialUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.credential.update({
      data,
      where,
    });
  }

  public async findCredential(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CredentialWhereUniqueInput;
    where?: Prisma.CredentialWhereInput;
    orderBy?: Prisma.CredentialOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.$transaction([
      this.prismaService.credential.count({
        where: {
          ...where,
        },
      }),
      this.prismaService.credential.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);
  }

  public async deleteCredential(params: {
    where: Prisma.CredentialWhereUniqueInput;
  }) {
    const { where } = params;

    return this.prismaService.credential.delete({
      where,
    });
  }
}
