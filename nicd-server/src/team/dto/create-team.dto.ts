import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'FC Barcelona', description: 'Team name' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  team_name: string;

  @ApiPropertyOptional({ example: 'https://fcbarcelona.com', description: 'Team website URL' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  url?: string;

  @ApiPropertyOptional({ example: '#004D98', description: 'Jersey color (hex code)' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  color_jersey?: string;

  @ApiPropertyOptional({ example: 'Barcelona, Spain', description: 'Team location' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  location?: string;

  @ApiPropertyOptional({ example: 'Professional', description: 'Team level' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  level?: string;
}
