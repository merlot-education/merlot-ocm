import type { TestingModule } from '@nestjs/testing';

import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import HealthController from './health.controller';

describe('Health', () => {
  let healthController: HealthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [HealthController],
      providers: [],
    }).compile();
    healthController = module.get<HealthController>(HealthController);
  });
  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should call getHealth', () => {
    const response = healthController.getHealth();
    expect(response.statusCode).toBe(HttpStatus.OK);
  });
});
