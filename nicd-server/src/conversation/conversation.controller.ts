import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConversationUserService } from '../conversation-user/conversation-user.service';
import { CreateConversationUserDto } from '../conversation-user/dto/create-conversation-user.dto';

@ApiTags('Conversations')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    @Inject(forwardRef(() => ConversationUserService))
    private readonly conversationUserService: ConversationUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.conversationService.createConversation(
      createConversationDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async getMyConversations(@CurrentUser('userId') userId: string) {
    return this.conversationService.getConversationsByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationById(@Param('id') conversationId: string) {
    return this.conversationService.getConversationById(conversationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async updateConversation(
    @Param('id') conversationId: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.updateConversation(
      conversationId,
      updateConversationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async deleteConversation(@Param('id') conversationId: string) {
    return this.conversationService.deleteConversation(conversationId);
  }

  // Conversation Users endpoints
  @Post(':id/users')
  @ApiOperation({ summary: 'Add a user to the conversation' })
  @ApiResponse({
    status: 201,
    description: 'User added to conversation',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User already in conversation' })
  async addUserToConversation(
    @Param('id') conversationId: string,
    @Body() createConversationUserDto: CreateConversationUserDto,
  ) {
    return this.conversationUserService.addUserToConversation(
      createConversationUserDto.user_id,
      conversationId,
    );
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getConversationUsers(@Param('id') conversationId: string) {
    return this.conversationUserService.getUsersByConversationId(conversationId);
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Remove a user from the conversation' })
  @ApiResponse({
    status: 200,
    description: 'User removed from conversation',
  })
  @ApiResponse({ status: 404, description: 'User not in conversation' })
  async removeUserFromConversation(
    @Param('id') conversationId: string,
    @Param('userId') userId: string,
  ) {
    return this.conversationUserService.removeUserFromConversation(
      userId,
      conversationId,
    );
  }
}
