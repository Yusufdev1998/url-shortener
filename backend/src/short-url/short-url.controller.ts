import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { getClientIp } from 'request-ip';

import { ShortUrlService } from './short-url.service';

import { Response, Request } from 'express';
import { CreateShortUrlDto } from './dto/create-short-url.dto';

@Controller()
export class ShortUrlController {
  constructor(private readonly service: ShortUrlService) {}

  @Post('shorten')
  async create(@Body() dto: CreateShortUrlDto) {
    const url = await this.service.create(dto);
    return {
      ...url,
      alias: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.alias}`,
    };
  }

  @Get('urls')
  async getAllUrls() {
    return this.service.getAllUrls();
  }

  @Get(':alias')
  async redirect(
    @Param('alias') alias: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const ip = getClientIp(req);
    const originalUrl = await this.service.redirect(alias, ip || 'unknown');
    return res.redirect(originalUrl);
  }

  @Get('info/:alias')
  async info(@Param('alias') alias: string) {
    return this.service.getInfo(alias);
  }

  @Delete('delete/:alias')
  @HttpCode(204)
  async delete(@Param('alias') alias: string) {
    await this.service.delete(alias);
  }

  @Get('analytics/:alias')
  async analytics(@Param('alias') alias: string) {
    return this.service.getAnalytics(alias);
  }
}
