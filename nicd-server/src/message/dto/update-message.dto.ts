import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty({
    description: 'The updated message content',
    example: 'Updated message content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
