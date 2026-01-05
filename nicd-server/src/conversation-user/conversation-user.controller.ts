import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationUserService } from './conversation-user.service';

// Note: ConversationUser endpoints are handled in ConversationController
// under /api/conversations/:id/users routes

@ApiTags('ConversationUsers')
@Controller('conversation-users')
export class ConversationUserController {
  constructor(
    private readonly conversationUserService: ConversationUserService,
  ) {}
}
