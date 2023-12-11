import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { DidsController } from './dids.controller.js';
import { DidsService } from './dids.service.js';

@Module({
  imports: [AgentModule],
  providers: [DidsService],
  controllers: [DidsController],
})
export class DidsModule {}
