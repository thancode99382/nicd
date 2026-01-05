import { HttpException, HttpStatus } from '@nestjs/common';

export class PollNotFoundException extends HttpException {
  constructor() {
    super('Poll not found', HttpStatus.NOT_FOUND);
  }
}
