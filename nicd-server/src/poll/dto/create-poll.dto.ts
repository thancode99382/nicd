import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({ example: 'match-uuid-123', description: 'Match ID' })
  @IsString()
  @IsNotEmpty()
  match_id: string;

  @ApiProperty({ example: 'Will you attend this match?', description: 'Poll question/content' })
  @IsString()
  @IsNotEmpty()
  poll_content: string;
}
