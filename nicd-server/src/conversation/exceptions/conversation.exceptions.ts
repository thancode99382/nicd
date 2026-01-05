import { HttpException, HttpStatus } from '@nestjs/common';

export class ConversationNotFoundException extends HttpException {
  constructor() {
    super('Conversation not found', HttpStatus.NOT_FOUND);
  }
}

export class UserNotInConversationException extends HttpException {
  constructor() {
    super('User is not a member of this conversation', HttpStatus.FORBIDDEN);
  }
}
