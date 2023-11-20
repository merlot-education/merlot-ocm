import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class CredentialDefRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createCredDef(data: Prisma.CredentialDefCreateInput) {
    const credDef = await this.prismaService.credentialDef.create({
      data,
    });

    await this.prismaService.schema.update({
      where: {
        schemaID: data.schemaID,
      },
      data: {
        credential_defs: {
          connect: {
            id: credDef.id,
          },
        },
      },
    });

    return credDef;
  }

  public async findCredentialDef(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CredentialDefWhereUniqueInput;
    where?: Prisma.CredentialDefWhereInput;
    orderBy?: Prisma.CredentialDefOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.$transaction([
      this.prismaService.credentialDef.count({
        where,
      }),
      this.prismaService.credentialDef.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);
  }

  public async findUniqueCredentialDef(params: {
    where: Prisma.CredentialDefWhereUniqueInput;
  }) {
    const { where } = params;
    return this.prismaService.credentialDef.findUnique({
      where,
    });
  }
}
