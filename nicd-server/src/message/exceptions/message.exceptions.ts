import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotFoundException extends HttpException {
  constructor() {
    super('Message not found', HttpStatus.NOT_FOUND);
  }
}

export class NotMessageOwnerException extends HttpException {
  constructor() {
    super('You can only edit or delete your own messages', HttpStatus.FORBIDDEN);
  }
}
