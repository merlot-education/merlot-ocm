import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import request from 'supertest';

import AppModule from '../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/health (GET)', () =>
    request(app.getHttpServer()).get('/health').expect(200));
});
