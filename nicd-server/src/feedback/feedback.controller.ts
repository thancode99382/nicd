import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit feedback' })
  @ApiResponse({
    status: 201,
    description: 'Feedback submitted successfully',
  })
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback' })
  @ApiResponse({
    status: 200,
    description: 'Feedback retrieved successfully',
  })
  async getAllFeedback() {
    return this.feedbackService.getAllFeedback();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiResponse({
    status: 200,
    description: 'Feedback retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async getFeedbackById(@Param('id') feedbackId: string) {
    return this.feedbackService.getFeedbackById(feedbackId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({
    status: 200,
    description: 'Feedback deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async deleteFeedback(@Param('id') feedbackId: string) {
    return this.feedbackService.deleteFeedback(feedbackId);
  }
}
