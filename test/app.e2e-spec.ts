import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from './../src/database/database.service';
import { userStub } from './../src/users/test/stubs/user.stub'
import { Connection } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from './../src/users/dto/create-user.dto';
import { productStub } from './../src/products/test/stubs/product.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  it('GET /auth/users : should return an array of users', async () => {
    const user = userStub();
    await dbConnection.collection('users').insertOne(user)
    const response = await request(httpServer).get('/auth/users');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([{
      username: user.username,
      password: expect.any(String),
    }]);
  })

  it('POST /auth/register : should return a 409 Conflict http code', async () => {
    const user = userStub();
    await dbConnection.collection('users').insertOne(user)
    const response = await request(httpServer).post('/auth/register').send(user);
    expect(response.status).toBe(409);
  })

  it('POST /auth/login : should return a 401 Unauthorized http code', async () => {
    const user = userStub();
    await dbConnection.collection('users').insertOne(user)
    const fakeUser = { username: user.username, password: 'wrong_password' };
    const response = await request(httpServer).post('/auth/login').send(fakeUser);
    expect(response.status).toBe(401);
  })

  it('GET /products/:unknown_barcode : should return a 404 http code', async () => {
    const user = userStub();
    await dbConnection.collection('users').insertOne(user)
    const responseLogin = await (await request(httpServer).post('/auth/login').send({username: user.username, password: 'password'}));
    const access_token = responseLogin.body.access_token;

    const response = await request(httpServer)
      .get('/products/76876587658765876567')
      .set('Authorization', 'bearer ' + access_token)
    expect(response.status).toBe(404);
  });

  it('End 2 end user journey /auth/register then /auth/login then /products/:barcode', async () => {
    const user = userStub();
    const createUserDto = { username: user.username, password: 'password' };
    const response = await request(httpServer).post('/auth/register').send(createUserDto);
    expect(response.status).toBe(201);

    const responseUsers = await request(httpServer).get('/auth/users');
    expect(responseUsers.status).toBe(200);
    expect(responseUsers.body).toMatchObject([{
      username: user.username,
      password: expect.any(String),
    }]);

    const responseLogin = await (await request(httpServer).post('/auth/login').send(createUserDto));
    expect(responseLogin.status).toBe(200);
    const access_token = responseLogin.body.access_token;
    expect(access_token).toEqual(expect.any(String));

    const product = productStub();
    let responseProduct = await request(httpServer)
      .get('/products/3046920022651')
    expect(responseProduct.status).toBe(401);
    responseProduct = await request(httpServer)
      .get('/products/3046920022651')
      .set('Authorization', 'bearer ' + access_token)
    expect(responseProduct.status).toBe(200);
    expect(responseProduct.body).toMatchObject(product);

  })

  afterAll(async () => {
    await app.close();
  });
});
