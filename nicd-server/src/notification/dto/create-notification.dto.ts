import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The notification description/message',
    example: 'You have a new message from John',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'The user ID to send the notification to',
    example: 'uuid-user-id',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
