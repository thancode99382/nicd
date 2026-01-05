import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.messageService.createMessage(createMessageDto, userId);
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getMessagesByConversation(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.messageService.getMessagesByConversationId(
      conversationId,
      limit,
      offset,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a message by ID' })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getMessageById(@Param('id') messageId: string) {
    return this.messageService.getMessageById(messageId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a message' })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Not message owner' })
  async updateMessage(
    @Param('id') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.messageService.updateMessage(messageId, updateMessageDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Not message owner' })
  async deleteMessage(
    @Param('id') messageId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.messageService.deleteMessage(messageId, userId);
  }
}
