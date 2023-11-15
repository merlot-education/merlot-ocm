import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class ConnectionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createConnection(data: Prisma.ConnectionCreateInput) {
    return this.prismaService.connection.create({ data });
  }

  async createShortUrl(connectionUrl: string) {
    return this.prismaService.shortUrlConnection.create({
      data: { connectionUrl },
    });
  }

  async getShortUrl(id: string) {
    return this.prismaService.shortUrlConnection.findUnique({
      where: { id },
    });
  }

  async updateConnection(params: {
    where: Prisma.ConnectionWhereUniqueInput;
    data: Prisma.ConnectionUpdateInput;
  }) {
    const { where, data } = params;

    return this.prismaService.connection.update({
      data,
      where,
    });
  }

  async updateManyConnection(params: {
    where: Prisma.ConnectionWhereInput;
    data: Prisma.ConnectionUpdateInput;
  }) {
    const { where, data } = params;

    return this.prismaService.connection.updateMany({
      data,
      where,
    });
  }

  async findConnections(params: {
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

  async findUniqueConnection(params: {
    where: Prisma.ConnectionWhereUniqueInput;
  }) {
    const { where } = params;

    return this.prismaService.connection.findUnique({
      where,
    });
  }

  findByConnectionId(connectionId: string) {
    const query = { where: { connectionId } };
    return this.findUniqueConnection(query);
  }

  findByConnectionByParticipantDID(participantDid: string) {
    const query = { where: { participantDid } };
    return this.findUniqueConnection(query);
  }
}
