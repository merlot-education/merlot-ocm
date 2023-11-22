import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module.js';

describe('DidCommController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/v1/agent/connections/createConnection (POST)', async () => {
    await request(app.getHttpServer())
      .post('v1/agent/connections/createConnection')
      .expect(200);
  });

  it('/v1/agent/info (GET)', async () => {
    await request(app.getHttpServer()).post('v1/agent/info').expect(200);
  });
});
