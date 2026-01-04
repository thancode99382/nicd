import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile image URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image_url: string;
}
