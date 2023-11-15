import { Module } from '@nestjs/common';
import PrismaService from './prisma.service.js';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule {}
