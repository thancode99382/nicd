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
import { TeamUserService } from './team-user.service';
import { CreateTeamUserDto } from './dto/create-team-user.dto';
import { UpdateTeamUserDto } from './dto/update-team-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('team-users')
@Controller('team-users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamUserController {
  constructor(private readonly teamUserService: TeamUserService) {}

  @Post()
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiResponse({ status: 201, description: 'Team member added successfully' })
  @ApiResponse({ status: 409, description: 'User already in team' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTeamUserDto: CreateTeamUserDto) {
    return this.teamUserService.create(createTeamUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team-user relationships' })
  @ApiResponse({ status: 200, description: 'Team users retrieved successfully' })
  async findAll() {
    return this.teamUserService.findAll();
  }

  @Get(':teamUserId')
  @ApiOperation({ summary: 'Get a team-user by ID' })
  @ApiResponse({ status: 200, description: 'Team user retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team user not found' })
  async findOne(@Param('teamUserId') teamUserId: string) {
    return this.teamUserService.findOne(teamUserId);
  }

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get all members of a team' })
  @ApiResponse({ status: 200, description: 'Team members retrieved successfully' })
  async findByTeam(@Param('teamId') teamId: string) {
    return this.teamUserService.findByTeam(teamId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all teams a user belongs to' })
  @ApiResponse({ status: 200, description: 'User teams retrieved successfully' })
  async findByUser(@Param('userId') userId: string) {
    return this.teamUserService.findByUser(userId);
  }

  @Patch(':teamUserId')
  @ApiOperation({ summary: 'Update a team-user' })
  @ApiResponse({ status: 200, description: 'Team user updated successfully' })
  @ApiResponse({ status: 404, description: 'Team user not found' })
  async update(
    @Param('teamUserId') teamUserId: string,
    @Body() updateTeamUserDto: UpdateTeamUserDto,
  ) {
    return this.teamUserService.update(teamUserId, updateTeamUserDto);
  }

  @Delete(':teamUserId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a user from a team' })
  @ApiResponse({ status: 200, description: 'Team member removed successfully' })
  @ApiResponse({ status: 404, description: 'Team user not found' })
  async remove(@Param('teamUserId') teamUserId: string) {
    return this.teamUserService.remove(teamUserId);
  }
}
