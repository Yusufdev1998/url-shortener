import { Test, TestingModule } from '@nestjs/testing';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Response, Request } from 'express';

describe('ShortUrlController', () => {
  let controller: ShortUrlController;
  let service: jest.Mocked<ShortUrlService>;

  const mockService = {
    create: jest.fn(),
    redirect: jest.fn(),
    getInfo: jest.fn(),
    delete: jest.fn(),
    getAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [{ provide: ShortUrlService, useValue: mockService }],
    }).compile();
    controller = module.get<ShortUrlController>(ShortUrlController);
    service = module.get(ShortUrlService);
    jest.clearAllMocks();
  });

  it('should create short url', async () => {
    service.create.mockResolvedValue({
      id: 1,
      alias: 'a',
      originalUrl: 'x',
      createdAt: new Date(),
      expiresAt: null,
      clickCount: 0,
      clicks: [],
    });
    const dto: CreateShortUrlDto = { originalUrl: 'x', alias: 'a' };
    const result = await controller.create(dto);
    expect(result.alias).toContain('a');
  });

  it('should redirect to original url', async () => {
    const res = { redirect: jest.fn() } as any as Response;
    const req = { ip: 'ip' } as Request;
    service.redirect.mockResolvedValue('http://test');
    await controller.redirect('a', res, req);
    expect(res.redirect).toHaveBeenCalledWith('http://test');
  });

  it('should get info', async () => {
    service.getInfo.mockResolvedValue({
      originalUrl: 'x',
      createdAt: new Date(),
      clickCount: 1,
    });
    const result = await controller.info('a');
    expect(result.originalUrl).toBe('x');
  });

  it('should delete', async () => {
    service.delete.mockResolvedValue(undefined);
    await expect(controller.delete('a')).resolves.toBeUndefined();
  });

  it('should get analytics', async () => {
    service.getAnalytics.mockResolvedValue({
      clickCount: 2,
      last5Ips: ['1', '2'],
    });
    const result = await controller.analytics('a');
    expect(result.clickCount).toBe(2);
    expect(result.last5Ips).toEqual(['1', '2']);
  });
});
