import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { TeamNotFoundException } from './exceptions/team.exceptions';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const team = this.teamRepository.create({
      team_id: uuidv4(),
      ...createTeamDto,
    });
    const savedTeam = await this.teamRepository.save(team);
    return ApiResponseBuilder.created('Team created successfully', savedTeam);
  }

  async findAll() {
    const teams = await this.teamRepository.find({
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Teams retrieved successfully', teams);
  }

  async findOne(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
    });
    if (!team) {
      throw new TeamNotFoundException();
    }
    return ApiResponseBuilder.ok('Team retrieved successfully', team);
  }

  async findOneEntity(teamId: string): Promise<Team | null> {
    return this.teamRepository.findOne({ where: { team_id: teamId } });
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
    });
    if (!team) {
      throw new TeamNotFoundException();
    }
    await this.teamRepository.update({ team_id: teamId }, updateTeamDto);
    const updatedTeam = await this.teamRepository.findOne({
      where: { team_id: teamId },
    });
    return ApiResponseBuilder.ok('Team updated successfully', updatedTeam);
  }

  async remove(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
    });
    if (!team) {
      throw new TeamNotFoundException();
    }
    await this.teamRepository.delete({ team_id: teamId });
    return ApiResponseBuilder.ok('Team deleted successfully');
  }

  async getTeamWithMembers(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: { team_id: teamId },
      relations: ['team_users', 'team_users.user'],
    });
    if (!team) {
      throw new TeamNotFoundException();
    }
    return ApiResponseBuilder.ok('Team with members retrieved successfully', team);
  }
}
