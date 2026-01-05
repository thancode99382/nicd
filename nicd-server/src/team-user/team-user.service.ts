import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TeamUser, TeamUserRole, TeamUserStatus } from './entities/team-user.entity';
import { CreateTeamUserDto } from './dto/create-team-user.dto';
import { UpdateTeamUserDto } from './dto/update-team-user.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  TeamUserNotFoundException,
  TeamUserAlreadyExistsException,
} from './exceptions/team-user.exceptions';

@Injectable()
export class TeamUserService {
  constructor(
    @InjectRepository(TeamUser)
    private readonly teamUserRepository: Repository<TeamUser>,
  ) {}

  async create(createTeamUserDto: CreateTeamUserDto) {
    // Check if user is already a member of the team
    const existing = await this.teamUserRepository.findOne({
      where: {
        team_id: createTeamUserDto.team_id,
        user_id: createTeamUserDto.user_id,
      },
    });
    if (existing) {
      throw new TeamUserAlreadyExistsException();
    }

    const teamUser = this.teamUserRepository.create({
      team_user_id: uuidv4(),
      ...createTeamUserDto,
    });
    const savedTeamUser = await this.teamUserRepository.save(teamUser);
    return ApiResponseBuilder.created('Team member added successfully', savedTeamUser);
  }

  async findAll() {
    const teamUsers = await this.teamUserRepository.find({
      relations: ['team', 'user'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Team users retrieved successfully', teamUsers);
  }

  async findOne(teamUserId: string) {
    const teamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
      relations: ['team', 'user'],
    });
    if (!teamUser) {
      throw new TeamUserNotFoundException();
    }
    return ApiResponseBuilder.ok('Team user retrieved successfully', teamUser);
  }

  async findOneEntity(teamUserId: string): Promise<TeamUser | null> {
    return this.teamUserRepository.findOne({ where: { team_user_id: teamUserId } });
  }

  async findByTeam(teamId: string) {
    const teamUsers = await this.teamUserRepository.find({
      where: { team_id: teamId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('Team members retrieved successfully', teamUsers);
  }

  async findByUser(userId: string) {
    const teamUsers = await this.teamUserRepository.find({
      where: { user_id: userId },
      relations: ['team'],
      order: { created_at: 'DESC' },
    });
    return ApiResponseBuilder.ok('User teams retrieved successfully', teamUsers);
  }

  async update(teamUserId: string, updateTeamUserDto: UpdateTeamUserDto) {
    const teamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    if (!teamUser) {
      throw new TeamUserNotFoundException();
    }
    await this.teamUserRepository.update({ team_user_id: teamUserId }, updateTeamUserDto);
    const updatedTeamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
      relations: ['team', 'user'],
    });
    return ApiResponseBuilder.ok('Team user updated successfully', updatedTeamUser);
  }

  async updateRole(teamUserId: string, role: TeamUserRole) {
    const teamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    if (!teamUser) {
      throw new TeamUserNotFoundException();
    }
    await this.teamUserRepository.update({ team_user_id: teamUserId }, { role });
    const updatedTeamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    return ApiResponseBuilder.ok('Role updated successfully', updatedTeamUser);
  }

  async updateStatus(teamUserId: string, status: TeamUserStatus) {
    const teamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    if (!teamUser) {
      throw new TeamUserNotFoundException();
    }
    await this.teamUserRepository.update({ team_user_id: teamUserId }, { status });
    const updatedTeamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    return ApiResponseBuilder.ok('Status updated successfully', updatedTeamUser);
  }

  async remove(teamUserId: string) {
    const teamUser = await this.teamUserRepository.findOne({
      where: { team_user_id: teamUserId },
    });
    if (!teamUser) {
      throw new TeamUserNotFoundException();
    }
    await this.teamUserRepository.delete({ team_user_id: teamUserId });
    return ApiResponseBuilder.ok('Team member removed successfully');
  }
}
