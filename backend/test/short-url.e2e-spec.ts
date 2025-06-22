import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ShortUrlController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create short url with unique alias', async () => {
    const alias = 'uniquealias';
    await request(app.getHttpServer())
      .post('/shorten')
      .send({ originalUrl: 'https://google.com', alias })
      .expect(201)
      .expect((res) => {
        expect(res.body.shortUrl).toContain(alias);
      });
  });

  it('should redirect to original url', async () => {
    const alias = 'redirecttest';
    await request(app.getHttpServer())
      .post('/shorten')
      .send({ originalUrl: 'https://example.com', alias })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/${alias}`)
      .expect(302)
      .expect('Location', 'https://example.com');
  });

  afterAll(async () => {
    await app.close();
  });
});
