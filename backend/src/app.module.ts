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
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [ShortUrl, Click],
      synchronize: true,
    }),
    ShortUrlModule,
  ],
})
export class AppModule {}
