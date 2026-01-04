import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'The feedback content',
    example: 'Great app! I love the user interface.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
