import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'player@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password (min 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'CR7', description: 'Display name' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'Riyadh', description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Forward', description: 'Soccer position' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '7', description: 'Preferred jersey number' })
  @IsString()
  @IsOptional()
  jersey_number?: string;
}
