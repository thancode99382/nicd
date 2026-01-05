import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamUserPollDto {
  @ApiProperty({ example: 'poll-uuid-123', description: 'Poll ID' })
  @IsString()
  @IsNotEmpty()
  poll_id: string;

  @ApiProperty({ example: 'team-user-uuid-456', description: 'Team User ID' })
  @IsString()
  @IsNotEmpty()
  team_user_id: string;
}
