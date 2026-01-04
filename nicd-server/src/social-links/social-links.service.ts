import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SocialLink } from './entities/social-link.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  SocialLinkNotFoundException,
  SocialLinkAlreadyExistsException,
  UnauthorizedSocialLinkAccessException,
} from './exceptions/social-links.exceptions';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,
  ) {}

  async create(userId: string, createSocialLinkDto: CreateSocialLinkDto) {
    // Check if user already has this platform
    const existingLink = await this.socialLinkRepository.findOne({
      where: {
        user_id: userId,
        platform_name: createSocialLinkDto.platform_name.toLowerCase(),
      },
    });

    if (existingLink) {
      throw new SocialLinkAlreadyExistsException(
        createSocialLinkDto.platform_name,
      );
    }

    const socialLink = this.socialLinkRepository.create({
      social_link_id: uuidv4(),
      platform_name: createSocialLinkDto.platform_name.toLowerCase(),
      url: createSocialLinkDto.url,
      user_id: userId,
    });

    const savedLink = await this.socialLinkRepository.save(socialLink);

    return ApiResponseBuilder.created('Social link created successfully', {
      social_link_id: savedLink.social_link_id,
      platform_name: savedLink.platform_name,
      url: savedLink.url,
      created_at: savedLink.created_at,
    });
  }

  async findAllByUserId(userId: string) {
    const socialLinks = await this.socialLinkRepository.find({
      where: { user_id: userId },
      order: { created_at: 'ASC' },
    });

    return ApiResponseBuilder.ok('Social links retrieved successfully', {
      social_links: socialLinks.map((link) => ({
        social_link_id: link.social_link_id,
        platform_name: link.platform_name,
        url: link.url,
        created_at: link.created_at,
        updated_at: link.updated_at,
      })),
    });
  }

  async findOne(socialLinkId: string) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { social_link_id: socialLinkId },
    });

    if (!socialLink) {
      throw new SocialLinkNotFoundException();
    }

    return ApiResponseBuilder.ok('Social link retrieved successfully', {
      social_link_id: socialLink.social_link_id,
      platform_name: socialLink.platform_name,
      url: socialLink.url,
      created_at: socialLink.created_at,
      updated_at: socialLink.updated_at,
    });
  }

  async update(
    userId: string,
    socialLinkId: string,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { social_link_id: socialLinkId },
    });

    if (!socialLink) {
      throw new SocialLinkNotFoundException();
    }

    if (socialLink.user_id !== userId) {
      throw new UnauthorizedSocialLinkAccessException();
    }

    // If updating platform_name, check for duplicates
    if (
      updateSocialLinkDto.platform_name &&
      updateSocialLinkDto.platform_name.toLowerCase() !==
        socialLink.platform_name
    ) {
      const existingLink = await this.socialLinkRepository.findOne({
        where: {
          user_id: userId,
          platform_name: updateSocialLinkDto.platform_name.toLowerCase(),
        },
      });

      if (existingLink) {
        throw new SocialLinkAlreadyExistsException(
          updateSocialLinkDto.platform_name,
        );
      }
    }

    const updateData: Partial<SocialLink> = {};
    if (updateSocialLinkDto.platform_name) {
      updateData.platform_name =
        updateSocialLinkDto.platform_name.toLowerCase();
    }
    if (updateSocialLinkDto.url) {
      updateData.url = updateSocialLinkDto.url;
    }

    await this.socialLinkRepository.update(
      { social_link_id: socialLinkId },
      updateData,
    );

    const updatedLink = await this.socialLinkRepository.findOne({
      where: { social_link_id: socialLinkId },
    });

    return ApiResponseBuilder.ok('Social link updated successfully', {
      social_link_id: updatedLink!.social_link_id,
      platform_name: updatedLink!.platform_name,
      url: updatedLink!.url,
      updated_at: updatedLink!.updated_at,
    });
  }

  async delete(userId: string, socialLinkId: string) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { social_link_id: socialLinkId },
    });

    if (!socialLink) {
      throw new SocialLinkNotFoundException();
    }

    if (socialLink.user_id !== userId) {
      throw new UnauthorizedSocialLinkAccessException();
    }

    await this.socialLinkRepository.delete({ social_link_id: socialLinkId });

    return ApiResponseBuilder.ok('Social link deleted successfully');
  }

  // Helper method for UserService to get social links
  async getSocialLinksByUserId(userId: string): Promise<SocialLink[]> {
    return this.socialLinkRepository.find({
      where: { user_id: userId },
      order: { created_at: 'ASC' },
    });
  }
}
