import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShortUrl } from './entities/short-url.entity';
import { Click } from './entities/click.entity';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { generateShortCode } from '../utils/functions';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepo: Repository<ShortUrl>,
    @InjectRepository(Click)
    private clickRepo: Repository<Click>,
  ) {}

  async create(dto: CreateShortUrlDto): Promise<ShortUrl> {
    let alias = dto.alias;
    if (alias) {
      const exists = await this.shortUrlRepo.findOne({ where: { alias } });
      if (exists) throw new ConflictException('Alias already exists');
    } else {
      // Generate unique alias
      do {
        alias = generateShortCode(8);
      } while (await this.shortUrlRepo.findOne({ where: { alias } }));
    }
    const shortUrl = this.shortUrlRepo.create({
      alias,
      originalUrl: dto.originalUrl,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    return this.shortUrlRepo.save(shortUrl);
  }

  async getAllUrls(): Promise<ShortUrl[]> {
    return this.shortUrlRepo.find();
  }
  async findByAlias(alias: string): Promise<ShortUrl> {
    const url = await this.shortUrlRepo.findOne({ where: { alias } });
    if (!url) throw new NotFoundException('Short URL not found');
    return url;
  }

  async redirect(alias: string, ip: string): Promise<string> {
    const url = await this.findByAlias(alias);

    if (url.expiresAt && new Date() > url.expiresAt)
      throw new NotFoundException('Short URL expired');

    url.clickCount += 1;
    await this.shortUrlRepo.save(url);

    await this.clickRepo.save(this.clickRepo.create({ shortUrl: url, ip }));

    return url.originalUrl;
  }

  async getInfo(alias: string) {
    const url = await this.findByAlias(alias);
    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  async delete(alias: string) {
    const url = await this.findByAlias(alias);
    await this.shortUrlRepo.remove(url);
  }

  async getAnalytics(alias: string) {
    console.log(alias);

    const url = await this.findByAlias(alias);
    const clicks = await this.clickRepo.find({
      where: { shortUrl: { id: url.id } },
      order: { clickedAt: 'DESC' },
      take: 5,
    });

    return {
      clickCount: url.clickCount,
      last5Ips: clicks.map((c) => c.ip),
    };
  }
}
