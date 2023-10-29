import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    app.close();
  });

  it('/auth/signup (POST)', () => {
    const email = 'some@email.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'password',
      })
      .expect(201)
      .then((res) => {
        const { id, email: resEmail } = res.body;
        expect(id).toBeDefined();
        expect(resEmail).toEqual(email);
      });
  });

  it('signup as a new user then get the curretly logged in user', async () => {
    const email = 'some@email.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'password',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
