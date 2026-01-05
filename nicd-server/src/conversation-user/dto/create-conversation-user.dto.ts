import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationUserDto {
  @ApiProperty({
    description: 'The user ID to add to the conversation',
    example: 'uuid-user-id',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
