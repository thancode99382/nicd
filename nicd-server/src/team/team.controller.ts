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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'Teams retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.teamService.findAll();
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('teamId') teamId: string) {
    return this.teamService.findOne(teamId);
  }

  @Get(':teamId/members')
  @ApiOperation({ summary: 'Get team with all members' })
  @ApiResponse({ status: 200, description: 'Team with members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeamWithMembers(@Param('teamId') teamId: string) {
    return this.teamService.getTeamWithMembers(teamId);
  }

  @Patch(':teamId')
  @ApiOperation({ summary: 'Update a team' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(teamId, updateTeamDto);
  }

  @Delete(':teamId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('teamId') teamId: string) {
    return this.teamService.remove(teamId);
  }
}
