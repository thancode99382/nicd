import { PartialType } from '@nestjs/swagger';
import { CreateConversationUserDto } from './create-conversation-user.dto';

export class UpdateConversationUserDto extends PartialType(CreateConversationUserDto) {}
