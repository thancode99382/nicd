import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamUserNotFoundException extends HttpException {
  constructor() {
    super('Team user not found', HttpStatus.NOT_FOUND);
  }
}

export class TeamUserAlreadyExistsException extends HttpException {
  constructor() {
    super('User is already a member of this team', HttpStatus.CONFLICT);
  }
}

export class InvalidRoleException extends HttpException {
  constructor() {
    super('Invalid role specified', HttpStatus.BAD_REQUEST);
  }
}
