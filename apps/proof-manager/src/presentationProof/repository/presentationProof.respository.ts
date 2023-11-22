import type { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import PrismaService from '../../prisma/prisma.service.js';

@Injectable()
export default class PresentationProofRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createPresentationProof(data: Prisma.ProofCreateInput) {
    return this.prismaService.proof.create({
      data,
    });
  }

  public async updatePresentationStatus(params: {
    where: Prisma.ProofWhereUniqueInput;
    data: Prisma.ProofUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.proof.update({
      data,
      where,
    });
  }

  public async findProofPresentation(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProofWhereUniqueInput;
    where?: Prisma.ProofWhereInput;
    orderBy?: Prisma.ProofOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.$transaction([
      this.prismaService.proof.count({
        where,
      }),
      this.prismaService.proof.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);
  }

  public async deleteProofRequest(proofRecordId: string) {
    return this.prismaService.proof.delete({
      where: { proofRecordId },
    });
  }

  public async createShortUrl(originalUrl: string) {
    return this.prismaService.shortUrl.create({
      data: {
        originalUrl,
      },
    });
  }

  public async getShortUrl(id: string) {
    return this.prismaService.shortUrl.findUnique({
      where: {
        id,
      },
    });
  }
}
