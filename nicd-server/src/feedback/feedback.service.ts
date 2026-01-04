import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { FeedbackNotFoundException } from './exceptions/feedback.exceptions';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const feedback = this.feedbackRepository.create({
      feedback_id: uuidv4(),
      content: createFeedbackDto.content,
    });

    const savedFeedback = await this.feedbackRepository.save(feedback);

    return ApiResponseBuilder.created('Feedback submitted successfully', {
      feedback_id: savedFeedback.feedback_id,
      content: savedFeedback.content,
      created_at: savedFeedback.created_at,
    });
  }

  async getAllFeedback() {
    const feedbacks = await this.feedbackRepository.find({
      order: { created_at: 'DESC' },
    });

    return ApiResponseBuilder.ok('Feedback retrieved successfully', feedbacks);
  }

  async getFeedbackById(feedbackId: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedback_id: feedbackId },
    });

    if (!feedback) {
      throw new FeedbackNotFoundException();
    }

    return ApiResponseBuilder.ok('Feedback retrieved successfully', feedback);
  }

  async deleteFeedback(feedbackId: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedback_id: feedbackId },
    });

    if (!feedback) {
      throw new FeedbackNotFoundException();
    }

    await this.feedbackRepository.delete({ feedback_id: feedbackId });

    return ApiResponseBuilder.ok('Feedback deleted successfully');
  }
}
