import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @ApiProperty({
    example: 'newSecurePassword456',
    description: 'New password (min 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}
