import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamNotFoundException extends HttpException {
  constructor() {
    super('Team not found', HttpStatus.NOT_FOUND);
  }
}

export class TeamAlreadyExistsException extends HttpException {
  constructor() {
    super('Team already exists', HttpStatus.CONFLICT);
  }
}
