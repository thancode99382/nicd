import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@ApiTags('social-links')
@Controller('social-links')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a social link' })
  @ApiResponse({ status: 201, description: 'Social link created successfully' })
  @ApiResponse({ status: 409, description: 'Social link already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createSocialLinkDto: CreateSocialLinkDto,
  ) {
    return this.socialLinksService.create(user.userId, createSocialLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all social links for current user' })
  @ApiResponse({
    status: 200,
    description: 'Social links retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.socialLinksService.findAllByUserId(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a social link by ID' })
  @ApiResponse({
    status: 200,
    description: 'Social link retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.socialLinksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a social link' })
  @ApiResponse({ status: 200, description: 'Social link updated successfully' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    return this.socialLinksService.update(user.userId, id, updateSocialLinkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a social link' })
  @ApiResponse({ status: 200, description: 'Social link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.socialLinksService.delete(user.userId, id);
  }
}
