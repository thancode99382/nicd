import { HttpException, HttpStatus } from '@nestjs/common';

export class ConversationUserNotFoundException extends HttpException {
  constructor() {
    super('User is not in this conversation', HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyInConversationException extends HttpException {
  constructor() {
    super('User is already in this conversation', HttpStatus.CONFLICT);
  }
}
