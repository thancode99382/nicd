import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  UserNotFoundException,
  InvalidCurrentPasswordException,
  SamePasswordException,
} from './exceptions/user.exceptions';
import { SocialLinksService } from '../social-links/social-links.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => SocialLinksService))
    private readonly socialLinksService: SocialLinksService,
  ) {}

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id: userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update({ user_id: userId }, updateData);
    return this.findByUserId(userId);
  }

  async updateVerificationCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.userRepository.update(
      { user_id: userId },
      {
        verification_code: code,
        verification_expires_at: expiresAt,
      },
    );
  }

  async markEmailVerified(userId: string): Promise<void> {
    await this.userRepository.update(
      { user_id: userId },
      {
        email_verified: true,
        verification_code: '',
        verification_expires_at: undefined,
      },
    );
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.userRepository.update({ user_id: userId }, {
      refresh_token_hash: refreshTokenHash,
    } as any);
  }

  async getProfile(userId: string) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const socialLinks =
      await this.socialLinksService.getSocialLinksByUserId(userId);

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
      social_links: socialLinks.map((link) => ({
        social_link_id: link.social_link_id,
        platform_name: link.platform_name,
        url: link.url,
      })),
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.update({ user_id: userId }, updateProfileDto);
    const updatedUser = await this.findByUserId(userId);

    return ApiResponseBuilder.ok('Profile updated successfully', {
      user_id: updatedUser!.user_id,
      email: updatedUser!.email,
      username: updatedUser!.username,
      location: updatedUser!.location,
      introduce: updatedUser!.introduce,
      image_url: updatedUser!.image_url,
      phone_number: updatedUser!.phone_number,
      position: updatedUser!.position,
      jersey_number: updatedUser!.jersey_number,
      email_verified: updatedUser!.email_verified,
      created_at: updatedUser!.created_at,
      updated_at: updatedUser!.updated_at,
    });
  }

  async updateImage(userId: string, imageUrl: string) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.update(
      { user_id: userId },
      { image_url: imageUrl },
    );
    const updatedUser = await this.findByUserId(userId);

    return ApiResponseBuilder.ok('Profile image updated successfully', {
      user_id: updatedUser!.user_id,
      image_url: updatedUser!.image_url,
      updated_at: updatedUser!.updated_at,
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!isCurrentPasswordValid) {
      throw new InvalidCurrentPasswordException();
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash,
    );
    if (isSamePassword) {
      throw new SamePasswordException();
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { user_id: userId },
      { password_hash: newPasswordHash },
    );

    return ApiResponseBuilder.ok('Password changed successfully');
  }

  async getPublicProfile(userId: string) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const socialLinks =
      await this.socialLinksService.getSocialLinksByUserId(userId);

    return ApiResponseBuilder.ok('Public profile retrieved successfully', {
      user_id: user.user_id,
      username: user.username,
      location: user.location,
      introduce: user.introduce,
      image_url: user.image_url,
      position: user.position,
      jersey_number: user.jersey_number,
      social_links: socialLinks.map((link) => ({
        social_link_id: link.social_link_id,
        platform_name: link.platform_name,
        url: link.url,
      })),
    });
  }

  async deleteUser(userId: string) {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.delete({ user_id: userId });

    return ApiResponseBuilder.ok('Account deleted successfully');
  }
}
