import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, Length } from 'class-validator';
import { TeamUserRole, TeamUserStatus } from '../entities/team-user.entity';

export class CreateTeamUserDto {
  @ApiProperty({ example: 'team-uuid-123', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  team_id: string;

  @ApiProperty({ example: 'user-uuid-456', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiPropertyOptional({
    example: 'normal',
    enum: TeamUserRole,
    description: 'User role in team',
  })
  @IsEnum(TeamUserRole)
  @IsOptional()
  role?: TeamUserRole;

  @ApiPropertyOptional({ example: '7', description: 'Preferred jersey number' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  jersey_number?: string;

  @ApiPropertyOptional({
    example: 'pending',
    enum: TeamUserStatus,
    description: 'Membership status',
  })
  @IsEnum(TeamUserStatus)
  @IsOptional()
  status?: TeamUserStatus;

  @ApiPropertyOptional({ example: 'Forward', description: 'Position in team' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  position?: string;
}
