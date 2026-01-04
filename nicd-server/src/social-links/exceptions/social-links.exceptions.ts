import {
  HttpException,
  HttpStatus,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

export class SocialLinkNotFoundException extends HttpException {
  constructor() {
    super('Social link not found', HttpStatus.NOT_FOUND);
  }
}

export class SocialLinkAlreadyExistsException extends ConflictException {
  constructor(platformName: string) {
    super(`You already have a ${platformName} social link`);
  }
}

export class UnauthorizedSocialLinkAccessException extends ForbiddenException {
  constructor() {
    super('You are not authorized to access this social link');
  }
}
