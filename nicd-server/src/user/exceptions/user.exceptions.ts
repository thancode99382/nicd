import {
  HttpException,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedUserAccessException extends ForbiddenException {
  constructor() {
    super('You are not authorized to access this resource');
  }
}

export class InvalidCurrentPasswordException extends BadRequestException {
  constructor() {
    super('Current password is incorrect');
  }
}

export class SamePasswordException extends BadRequestException {
  constructor() {
    super('New password must be different from current password');
  }
}

export class InvalidUserDataException extends BadRequestException {
  constructor(message: string = 'Invalid user data provided') {
    super(message);
  }
}
