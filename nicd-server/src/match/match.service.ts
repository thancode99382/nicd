import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { MatchNotFoundException } from './exceptions/match.exceptions';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const match = this.matchRepository.create({
      match_id: uuidv4(),
      ...createMatchDto,
      time: new Date(createMatchDto.time),
    });
    const savedMatch = await this.matchRepository.save(match);
    return ApiResponseBuilder.created('Match created successfully', savedMatch);
  }

  async findAll() {
    const matches = await this.matchRepository.find({
      relations: ['team'],
      order: { time: 'DESC' },
    });
    return ApiResponseBuilder.ok('Matches retrieved successfully', matches);
  }

  async findOne(matchId: string) {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['team'],
    });
    if (!match) {
      throw new MatchNotFoundException();
    }
    return ApiResponseBuilder.ok('Match retrieved successfully', match);
  }

  async findOneEntity(matchId: string): Promise<Match | null> {
    return this.matchRepository.findOne({ where: { match_id: matchId } });
  }

  async findByTeam(teamId: string) {
    const matches = await this.matchRepository.find({
      where: { team_id: teamId },
      order: { time: 'DESC' },
    });
    return ApiResponseBuilder.ok('Team matches retrieved successfully', matches);
  }

  async update(matchId: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
    });
    if (!match) {
      throw new MatchNotFoundException();
    }

    const updateData: Partial<Match> = {};
    if (updateMatchDto.team_id) updateData.team_id = updateMatchDto.team_id;
    if (updateMatchDto.opponent_name) updateData.opponent_name = updateMatchDto.opponent_name;
    if (updateMatchDto.location) updateData.location = updateMatchDto.location;
    if (updateMatchDto.time) updateData.time = new Date(updateMatchDto.time);

    await this.matchRepository.update({ match_id: matchId }, updateData);
    const updatedMatch = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['team'],
    });
    return ApiResponseBuilder.ok('Match updated successfully', updatedMatch);
  }

  async remove(matchId: string) {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
    });
    if (!match) {
      throw new MatchNotFoundException();
    }
    await this.matchRepository.delete({ match_id: matchId });
    return ApiResponseBuilder.ok('Match deleted successfully');
  }

  async getMatchWithPolls(matchId: string) {
    const match = await this.matchRepository.findOne({
      where: { match_id: matchId },
      relations: ['team', 'polls'],
    });
    if (!match) {
      throw new MatchNotFoundException();
    }
    return ApiResponseBuilder.ok('Match with polls retrieved successfully', match);
  }
}
