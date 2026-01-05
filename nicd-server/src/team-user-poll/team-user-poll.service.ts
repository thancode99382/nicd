import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TeamUserPoll } from './entities/team-user-poll.entity';
import { CreateTeamUserPollDto } from './dto/create-team-user-poll.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  TeamUserPollNotFoundException,
  AlreadyVotedException,
} from './exceptions/team-user-poll.exceptions';

@Injectable()
export class TeamUserPollService {
  constructor(
    @InjectRepository(TeamUserPoll)
    private readonly teamUserPollRepository: Repository<TeamUserPoll>,
  ) {}

  async vote(createTeamUserPollDto: CreateTeamUserPollDto) {
    // Check if already voted
    const existing = await this.teamUserPollRepository.findOne({
      where: {
        poll_id: createTeamUserPollDto.poll_id,
        team_user_id: createTeamUserPollDto.team_user_id,
      },
    });
    if (existing) {
      throw new AlreadyVotedException();
    }

    const teamUserPoll = this.teamUserPollRepository.create({
      team_user_poll_id: uuidv4(),
      ...createTeamUserPollDto,
    });
    const savedVote = await this.teamUserPollRepository.save(teamUserPoll);
    return ApiResponseBuilder.created('Vote recorded successfully', savedVote);
  }

  async unvote(pollId: string, teamUserId: string) {
    const vote = await this.teamUserPollRepository.findOne({
      where: { poll_id: pollId, team_user_id: teamUserId },
    });
    if (!vote) {
      throw new TeamUserPollNotFoundException();
    }
    await this.teamUserPollRepository.delete({ team_user_poll_id: vote.team_user_poll_id });
    return ApiResponseBuilder.ok('Vote removed successfully');
  }

  async findAll() {
    const votes = await this.teamUserPollRepository.find({
      relations: ['poll', 'team_user'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Votes retrieved successfully', votes);
  }

  async findOne(teamUserPollId: string) {
    const vote = await this.teamUserPollRepository.findOne({
      where: { team_user_poll_id: teamUserPollId },
      relations: ['poll', 'team_user'],
    });
    if (!vote) {
      throw new TeamUserPollNotFoundException();
    }
    return ApiResponseBuilder.ok('Vote retrieved successfully', vote);
  }

  async getVotesByPoll(pollId: string) {
    const votes = await this.teamUserPollRepository.find({
      where: { poll_id: pollId },
      relations: ['team_user', 'team_user.user'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Poll votes retrieved successfully', votes);
  }

  async getVotesByTeamUser(teamUserId: string) {
    const votes = await this.teamUserPollRepository.find({
      where: { team_user_id: teamUserId },
      relations: ['poll'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('User votes retrieved successfully', votes);
  }

  async remove(teamUserPollId: string) {
    const vote = await this.teamUserPollRepository.findOne({
      where: { team_user_poll_id: teamUserPollId },
    });
    if (!vote) {
      throw new TeamUserPollNotFoundException();
    }
    await this.teamUserPollRepository.delete({ team_user_poll_id: teamUserPollId });
    return ApiResponseBuilder.ok('Vote deleted successfully');
  }
}
