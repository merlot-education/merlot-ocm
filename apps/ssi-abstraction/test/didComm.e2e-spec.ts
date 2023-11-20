import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import AppModule from '../src/app.module';

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

  it('/v1/agent/connections/createConnection (POST)', () => {
    request(app.getHttpServer())
      .post('v1/agent/connections/createConnection')
      .expect(200);
  });

  it('/v1/agent/info (GET)', () => {
    request(app.getHttpServer()).post('v1/agent/info').expect(200);
  });
});
