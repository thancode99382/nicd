import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid email or password');
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid or expired refresh token');
  }
}

export class EmailNotVerifiedException extends ForbiddenException {
  constructor() {
    super('Email not verified. Please verify your email first.');
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('Email already registered');
  }
}

export class VerificationCodeExpiredException extends BadRequestException {
  constructor() {
    super('Verification code has expired. Please request a new one.');
  }
}

export class InvalidVerificationCodeException extends BadRequestException {
  constructor() {
    super('Invalid verification code');
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
