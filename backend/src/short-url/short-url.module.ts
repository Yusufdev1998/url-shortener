import { Module } from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { ShortUrlController } from './short-url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { Click } from './entities/click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl, Click])],
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
})
export class ShortUrlModule {}
