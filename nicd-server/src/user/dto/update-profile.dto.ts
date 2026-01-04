import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'CR7', description: 'Display name' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  username?: string;

  @ApiPropertyOptional({ example: 'Riyadh', description: 'Location' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  location?: string;

  @ApiPropertyOptional({
    example: 'Professional football player',
    description: 'User introduction',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  introduce?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  phone_number?: string;

  @ApiPropertyOptional({ example: 'Forward', description: 'Soccer position' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  position?: string;

  @ApiPropertyOptional({ example: '7', description: 'Preferred jersey number' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  jersey_number?: string;
}
