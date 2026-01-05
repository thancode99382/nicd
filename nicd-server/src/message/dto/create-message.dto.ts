import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The message content',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The conversation ID',
    example: 'uuid-conversation-id',
  })
  @IsString()
  @IsNotEmpty()
  conversation_id: string;
}
