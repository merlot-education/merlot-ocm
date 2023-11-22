import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class ConnectionRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createConnection(data: Prisma.ConnectionCreateInput) {
    return this.prismaService.connection.create({ data });
  }

  public async createShortUrl(connectionUrl: string) {
    return this.prismaService.shortUrlConnection.create({
      data: { connectionUrl },
    });
  }

  public async getShortUrl(id: string) {
    return this.prismaService.shortUrlConnection.findUnique({
      where: { id },
    });
  }

  public async updateConnection(params: {
    where: Prisma.ConnectionWhereUniqueInput;
    data: Prisma.ConnectionUpdateInput;
  }) {
    const { where, data } = params;

    return this.prismaService.connection.update({
      data,
      where,
    });
  }

  public async updateManyConnection(params: {
    where: Prisma.ConnectionWhereInput;
    data: Prisma.ConnectionUpdateInput;
  }) {
    const { where, data } = params;

    return this.prismaService.connection.updateMany({
      data,
      where,
    });
  }

  public async findConnections(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConnectionWhereUniqueInput;
    where?: Prisma.ConnectionWhereInput;
    orderBy?: Prisma.ConnectionOrderByWithRelationInput;
    select?: Prisma.ConnectionSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;

    if (where) {
      where.isActive = true;
    }

    return this.prismaService.$transaction([
      this.prismaService.connection.count({ where }),
      this.prismaService.connection.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select,
      }),
    ]);
  }

  public async findUniqueConnection(params: {
    where: Prisma.ConnectionWhereUniqueInput;
  }) {
    const { where } = params;

    return this.prismaService.connection.findUnique({
      where,
    });
  }

  public findByConnectionId(connectionId: string) {
    const query = { where: { connectionId } };
    return this.findUniqueConnection(query);
  }

  public findByConnectionByParticipantDID(participantDid: string) {
    const query = { where: { participantDid } };
    return this.findUniqueConnection(query);
  }
}
