import {
  Controller,
  Get,
  Post,
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
import { TeamUserPollService } from './team-user-poll.service';
import { CreateTeamUserPollDto } from './dto/create-team-user-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('team-user-polls')
@Controller('team-user-polls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamUserPollController {
  constructor(private readonly teamUserPollService: TeamUserPollService) {}

  @Post()
  @ApiOperation({ summary: 'Vote on a poll' })
  @ApiResponse({ status: 201, description: 'Vote recorded successfully' })
  @ApiResponse({ status: 409, description: 'Already voted' })
  async vote(@Body() createTeamUserPollDto: CreateTeamUserPollDto) {
    return this.teamUserPollService.vote(createTeamUserPollDto);
  }

  @Delete('poll/:pollId/team-user/:teamUserId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove vote from a poll' })
  @ApiResponse({ status: 200, description: 'Vote removed successfully' })
  @ApiResponse({ status: 404, description: 'Vote not found' })
  async unvote(
    @Param('pollId') pollId: string,
    @Param('teamUserId') teamUserId: string,
  ) {
    return this.teamUserPollService.unvote(pollId, teamUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all votes' })
  @ApiResponse({ status: 200, description: 'Votes retrieved successfully' })
  async findAll() {
    return this.teamUserPollService.findAll();
  }

  @Get(':teamUserPollId')
  @ApiOperation({ summary: 'Get a vote by ID' })
  @ApiResponse({ status: 200, description: 'Vote retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vote not found' })
  async findOne(@Param('teamUserPollId') teamUserPollId: string) {
    return this.teamUserPollService.findOne(teamUserPollId);
  }

  @Get('poll/:pollId')
  @ApiOperation({ summary: 'Get all votes for a poll' })
  @ApiResponse({ status: 200, description: 'Poll votes retrieved successfully' })
  async getVotesByPoll(@Param('pollId') pollId: string) {
    return this.teamUserPollService.getVotesByPoll(pollId);
  }

  @Get('team-user/:teamUserId')
  @ApiOperation({ summary: 'Get all votes by a team user' })
  @ApiResponse({ status: 200, description: 'User votes retrieved successfully' })
  async getVotesByTeamUser(@Param('teamUserId') teamUserId: string) {
    return this.teamUserPollService.getVotesByTeamUser(teamUserId);
  }

  @Delete(':teamUserPollId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vote' })
  @ApiResponse({ status: 200, description: 'Vote deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vote not found' })
  async remove(@Param('teamUserPollId') teamUserPollId: string) {
    return this.teamUserPollService.remove(teamUserPollId);
  }
}
