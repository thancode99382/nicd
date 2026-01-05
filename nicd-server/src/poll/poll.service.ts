import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Poll } from './entities/poll.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { PollNotFoundException } from './exceptions/poll.exceptions';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto) {
    const poll = this.pollRepository.create({
      poll_id: uuidv4(),
      ...createPollDto,
    });
    const savedPoll = await this.pollRepository.save(poll);
    return ApiResponseBuilder.created('Poll created successfully', savedPoll);
  }

  async findAll() {
    const polls = await this.pollRepository.find({
      relations: ['match'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Polls retrieved successfully', polls);
  }

  async findOne(pollId: string) {
    const poll = await this.pollRepository.findOne({
      where: { poll_id: pollId },
      relations: ['match'],
    });
    if (!poll) {
      throw new PollNotFoundException();
    }
    return ApiResponseBuilder.ok('Poll retrieved successfully', poll);
  }

  async findOneEntity(pollId: string): Promise<Poll | null> {
    return this.pollRepository.findOne({ where: { poll_id: pollId } });
  }

  async findByMatch(matchId: string) {
    const polls = await this.pollRepository.find({
      where: { match_id: matchId },
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Match polls retrieved successfully', polls);
  }

  async update(pollId: string, updatePollDto: UpdatePollDto) {
    const poll = await this.pollRepository.findOne({
      where: { poll_id: pollId },
    });
    if (!poll) {
      throw new PollNotFoundException();
    }
    await this.pollRepository.update({ poll_id: pollId }, updatePollDto);
    const updatedPoll = await this.pollRepository.findOne({
      where: { poll_id: pollId },
      relations: ['match'],
    });
    return ApiResponseBuilder.ok('Poll updated successfully', updatedPoll);
  }

  async remove(pollId: string) {
    const poll = await this.pollRepository.findOne({
      where: { poll_id: pollId },
    });
    if (!poll) {
      throw new PollNotFoundException();
    }
    await this.pollRepository.delete({ poll_id: pollId });
    return ApiResponseBuilder.ok('Poll deleted successfully');
  }

  async getPollWithVotes(pollId: string) {
    const poll = await this.pollRepository.findOne({
      where: { poll_id: pollId },
      relations: ['match', 'votes', 'votes.team_user', 'votes.team_user.user'],
    });
    if (!poll) {
      throw new PollNotFoundException();
    }
    return ApiResponseBuilder.ok('Poll with votes retrieved successfully', poll);
  }
}
