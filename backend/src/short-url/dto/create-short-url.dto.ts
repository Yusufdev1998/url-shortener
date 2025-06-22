import {
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string;
}
