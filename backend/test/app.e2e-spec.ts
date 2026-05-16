import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET) - should return health status', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
        expect(res.body.uptime).toBeDefined();
      });
  });

  it('/api/auth/register (POST) - should register a new user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
