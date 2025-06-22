import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrlModule } from './short-url/short-url.module';
import { ShortUrl } from './short-url/entities/short-url.entity';
import { Click } from './short-url/entities/click.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'shortener',
      entities: [ShortUrl, Click],
      synchronize: true,
    }),
    ShortUrlModule,
  ],
})
export class AppModule {}
