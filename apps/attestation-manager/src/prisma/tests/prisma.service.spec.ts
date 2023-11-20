import type { TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import PrismaService from '../prisma.service.js';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ConfigService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit()', () => {
    let res: unknown;

    beforeEach(async () => {
      res = await prismaService.onModuleInit();
    });

    it('should not return anything', async () => {
      expect(res).toBeUndefined();
    });
  });

  describe('onModuleDestroy()', () => {
    let res: unknown;

    beforeEach(async () => {
      res = await prismaService.onModuleDestroy();
    });

    it('should not return anything', async () => {
      expect(res).toBeUndefined();
    });
  });
});
