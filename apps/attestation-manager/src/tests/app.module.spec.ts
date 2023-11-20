import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';

import AppModule from '../app.module.js';

describe('App Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should work', () => {
    expect(true).toBe(true);
  });
});
