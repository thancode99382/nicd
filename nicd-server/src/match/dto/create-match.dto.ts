import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString, Length } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'team-uuid-123', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  team_id: string;

  @ApiProperty({ example: 'Real Madrid', description: 'Opponent team name' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  opponent_name: string;

  @ApiProperty({ example: '2026-01-15T19:00:00Z', description: 'Match date and time' })
  @IsDateString()
  @IsNotEmpty()
  time: string;

  @ApiPropertyOptional({ example: 'Camp Nou', description: 'Match location' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  location?: string;
}
