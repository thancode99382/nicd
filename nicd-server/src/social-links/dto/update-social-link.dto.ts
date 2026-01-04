import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSocialLinkDto {
  @ApiPropertyOptional({
    example: 'twitter',
    description: 'Platform name (e.g., github, twitter, facebook, linkedin)',
  })
  @IsString()
  @IsOptional()
  platform_name?: string;

  @ApiPropertyOptional({
    example: 'https://twitter.com/username',
    description: 'URL to the social profile',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  url?: string;
}
