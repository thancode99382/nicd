import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'The conversation name',
    example: 'Team Chat',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  conversation_name?: string;

  @ApiProperty({
    description: 'The conversation image URL',
    example: 'https://example.com/image.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  image_url?: string;

  @ApiProperty({
    description: 'The team ID (for team conversations)',
    example: 'uuid-team-id',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  team_id?: string;
}
