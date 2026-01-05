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
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('matches')
@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  async findAll() {
    return this.matchService.findAll();
  }

  @Get(':matchId')
  @ApiOperation({ summary: 'Get a match by ID' })
  @ApiResponse({ status: 200, description: 'Match retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async findOne(@Param('matchId') matchId: string) {
    return this.matchService.findOne(matchId);
  }

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get all matches for a team' })
  @ApiResponse({ status: 200, description: 'Team matches retrieved successfully' })
  async findByTeam(@Param('teamId') teamId: string) {
    return this.matchService.findByTeam(teamId);
  }

  @Get(':matchId/polls')
  @ApiOperation({ summary: 'Get match with all polls' })
  @ApiResponse({ status: 200, description: 'Match with polls retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatchWithPolls(@Param('matchId') matchId: string) {
    return this.matchService.getMatchWithPolls(matchId);
  }

  @Patch(':matchId')
  @ApiOperation({ summary: 'Update a match' })
  @ApiResponse({ status: 200, description: 'Match updated successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async update(
    @Param('matchId') matchId: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.update(matchId, updateMatchDto);
  }

  @Delete(':matchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a match' })
  @ApiResponse({ status: 200, description: 'Match deleted successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async remove(@Param('matchId') matchId: string) {
    return this.matchService.remove(matchId);
  }
}
