import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  EmailNotVerifiedException,
  EmailAlreadyExistsException,
  VerificationCodeExpiredException,
  InvalidVerificationCodeException,
  UserNotFoundException,
} from './exceptions/auth.exceptions';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_token_expires_in: string;
  refresh_token_expires_in: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const userId = uuidv4();
    const verificationCode = this.generateVerificationCode();
    const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await this.userService.create({
      user_id: userId,
      email: registerDto.email,
      password_hash: passwordHash,
      username: registerDto.username,
      location: registerDto.location,
      position: registerDto.position,
      jersey_number: registerDto.jersey_number,
      email_verified: false,
      verification_code: verificationCode,
      verification_expires_at: verificationExpiresAt,
    });

    await this.emailService.sendVerificationCode(user.email, verificationCode);

    return ApiResponseBuilder.created(
      'Registration successful. Please check your email for verification code.',
      {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        email_verified: user.email_verified,
        created_at: user.created_at,
      },
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userService.findByEmail(verifyEmailDto.email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.verification_code !== verifyEmailDto.code) {
      throw new InvalidVerificationCodeException();
    }

    if (
      user.verification_expires_at &&
      new Date() > user.verification_expires_at
    ) {
      throw new VerificationCodeExpiredException();
    }

    await this.userService.markEmailVerified(user.user_id);

    return ApiResponseBuilder.ok(
      'Email verified successfully. You can now login.',
      {
        email: user.email,
        email_verified: true,
      },
    );
  }

  async resendVerification(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const verificationCode = this.generateVerificationCode();
    const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.userService.updateVerificationCode(
      user.user_id,
      verificationCode,
      verificationExpiresAt,
    );

    await this.emailService.sendVerificationCode(email, verificationCode);

    return ApiResponseBuilder.ok('Verification code sent to your email.', {
      email,
      expires_in: '10 minutes',
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    if (!user.email_verified) {
      throw new EmailNotVerifiedException();
    }

    const tokens = await this.generateTokens(user.user_id, user.email);

    const refreshTokenHash = await bcrypt.hash(tokens.refresh_token, 10);
    await this.userService.updateRefreshTokenHash(
      user.user_id,
      refreshTokenHash,
    );

    return ApiResponseBuilder.ok('Login successful', {
      ...tokens,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
      },
    });
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.userService.findByUserId(payload.sub);
    if (!user || !user.refresh_token_hash) {
      throw new InvalidRefreshTokenException();
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash,
    );
    if (!isRefreshTokenValid) {
      throw new InvalidRefreshTokenException();
    }

    const tokens = await this.generateTokens(user.user_id, user.email);

    const newRefreshTokenHash = await bcrypt.hash(tokens.refresh_token, 10);
    await this.userService.updateRefreshTokenHash(
      user.user_id,
      newRefreshTokenHash,
    );

    return ApiResponseBuilder.ok('Token refreshed successfully', tokens);
  }

  async logout(userId: string) {
    await this.userService.updateRefreshTokenHash(userId, null);
    return ApiResponseBuilder.ok('Logged out successfully');
  }

  async getProfile(userId: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    return ApiResponseBuilder.ok('Profile retrieved successfully', {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      location: user.location,
      introduce: user.introduce,
      image_url: user.image_url,
      phone_number: user.phone_number,
      position: user.position,
      jersey_number: user.jersey_number,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const payload = { sub: userId, email };

    const accessExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessExpiresIn,
      } as any),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn,
      } as any),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      access_token_expires_in: this.configService.get<string>(
        'JWT_ACCESS_EXPIRES_IN',
        '15m',
      ),
      refresh_token_expires_in: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ),
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
