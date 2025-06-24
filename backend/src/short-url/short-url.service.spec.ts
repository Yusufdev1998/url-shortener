import { Test, TestingModule } from '@nestjs/testing';
import { ShortUrlService } from './short-url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { Click } from './entities/click.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';

const mockShortUrlRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});
const mockClickRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('ShortUrlService', () => {
  let service: ShortUrlService;
  let shortUrlRepo: jest.Mocked<Repository<ShortUrl>>;
  let clickRepo: jest.Mocked<Repository<Click>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortUrlService,
        { provide: getRepositoryToken(ShortUrl), useFactory: mockShortUrlRepo },
        { provide: getRepositoryToken(Click), useFactory: mockClickRepo },
      ],
    }).compile();
    service = module.get<ShortUrlService>(ShortUrlService);
    shortUrlRepo = module.get(getRepositoryToken(ShortUrl));
    clickRepo = module.get(getRepositoryToken(Click));
  });

  describe('create', () => {
    it('should throw ConflictException if alias exists', async () => {
      shortUrlRepo.findOne.mockResolvedValueOnce({} as ShortUrl);
      await expect(
        service.create({ originalUrl: 'x', alias: 'a' } as CreateShortUrlDto),
      ).rejects.toThrow(ConflictException);
    });
    it('should generate unique alias if not provided', async () => {
      shortUrlRepo.findOne.mockResolvedValueOnce(null);
      shortUrlRepo.create.mockReturnValue({} as ShortUrl);
      shortUrlRepo.save.mockResolvedValue({ alias: 'generated' } as ShortUrl);
      const dto = { originalUrl: 'x' } as CreateShortUrlDto;
      const result = await service.create(dto);
      expect(result.alias).toBe('generated');
    });
    it('should create with provided alias if unique', async () => {
      shortUrlRepo.findOne.mockResolvedValueOnce(null);
      shortUrlRepo.create.mockReturnValue({ alias: 'a' } as ShortUrl);
      shortUrlRepo.save.mockResolvedValue({ alias: 'a' } as ShortUrl);
      const dto = { originalUrl: 'x', alias: 'a' } as CreateShortUrlDto;
      const result = await service.create(dto);
      expect(result.alias).toBe('a');
    });
  });

  describe('findByAlias', () => {
    it('should throw NotFoundException if not found', async () => {
      shortUrlRepo.findOne.mockResolvedValue(null);
      await expect(service.findByAlias('a')).rejects.toThrow(NotFoundException);
    });
    it('should return ShortUrl if found', async () => {
      shortUrlRepo.findOne.mockResolvedValue({ alias: 'a' } as ShortUrl);
      const result = await service.findByAlias('a');
      expect(result.alias).toBe('a');
    });
  });

  describe('redirect', () => {
    it('should throw if expired', async () => {
      const expired = { expiresAt: new Date(Date.now() - 1000) } as ShortUrl;
      jest.spyOn(service, 'findByAlias').mockResolvedValue(expired);
      await expect(service.redirect('a', 'ip')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should increment clickCount and save click', async () => {
      const url = {
        expiresAt: null,
        clickCount: 0,
        originalUrl: 'x',
      } as ShortUrl;
      jest.spyOn(service, 'findByAlias').mockResolvedValue(url);
      shortUrlRepo.save.mockResolvedValue(url);
      clickRepo.create.mockReturnValue({} as Click);
      clickRepo.save.mockResolvedValue({} as Click);
      const result = await service.redirect('a', 'ip');
      expect(result).toBe('x');
      expect(url.clickCount).toBe(1);
    });
  });

  describe('getInfo', () => {
    it('should return info', async () => {
      const url = {
        originalUrl: 'x',
        createdAt: new Date(),
        clickCount: 2,
      } as ShortUrl;
      jest.spyOn(service, 'findByAlias').mockResolvedValue(url);
      const result = await service.getInfo('a');
      expect(result.originalUrl).toBe('x');
      expect(result.clickCount).toBe(2);
    });
  });

  describe('delete', () => {
    it('should remove url', async () => {
      const url = { alias: 'a' } as ShortUrl;
      jest.spyOn(service, 'findByAlias').mockResolvedValue(url);
      shortUrlRepo.remove.mockResolvedValue(url);
      await expect(service.delete('a')).resolves.not.toThrow();
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics', async () => {
      const url = { alias: 'a', clickCount: 5 } as ShortUrl;
      const clicks = [{ ip: '1' }, { ip: '2' }, { ip: '3' }] as Click[];
      jest.spyOn(service, 'findByAlias').mockResolvedValue(url);
      clickRepo.find.mockResolvedValue(clicks);
      const result = await service.getAnalytics('a');
      expect(result.clickCount).toBe(5);
      expect(result.last5Ips).toEqual(['1', '2', '3']);
    });
  });
});
