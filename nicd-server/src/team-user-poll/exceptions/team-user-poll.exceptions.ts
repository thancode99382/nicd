import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamUserPollNotFoundException extends HttpException {
  constructor() {
    super('Vote not found', HttpStatus.NOT_FOUND);
  }
}

export class AlreadyVotedException extends HttpException {
  constructor() {
    super('User has already voted on this poll', HttpStatus.CONFLICT);
  }
}
