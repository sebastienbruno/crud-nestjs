import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import e from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) users', () => {
    try {
      return request(app.getHttpServer())
        .get('/auth/users')
        .expect(200);
    }
    catch (e) {
      throw e;
    }
  });

  afterEach(async () => {
    app.close();
  });

  afterAll(async () => {
    await app.close();
  });
});
