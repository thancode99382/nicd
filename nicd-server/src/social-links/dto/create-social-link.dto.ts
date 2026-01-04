import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
  @ApiProperty({
    example: 'github',
    description: 'Platform name (e.g., github, twitter, facebook, linkedin)',
  })
  @IsString()
  @IsNotEmpty()
  platform_name: string;

  @ApiProperty({
    example: 'https://github.com/username',
    description: 'URL to the social profile',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
