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
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('polls')
@Controller('polls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new poll' })
  @ApiResponse({ status: 201, description: 'Poll created successfully' })
  async create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all polls' })
  @ApiResponse({ status: 200, description: 'Polls retrieved successfully' })
  async findAll() {
    return this.pollService.findAll();
  }

  @Get(':pollId')
  @ApiOperation({ summary: 'Get a poll by ID' })
  @ApiResponse({ status: 200, description: 'Poll retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async findOne(@Param('pollId') pollId: string) {
    return this.pollService.findOne(pollId);
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: 'Get all polls for a match' })
  @ApiResponse({ status: 200, description: 'Match polls retrieved successfully' })
  async findByMatch(@Param('matchId') matchId: string) {
    return this.pollService.findByMatch(matchId);
  }

  @Get(':pollId/votes')
  @ApiOperation({ summary: 'Get poll with all votes' })
  @ApiResponse({ status: 200, description: 'Poll with votes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async getPollWithVotes(@Param('pollId') pollId: string) {
    return this.pollService.getPollWithVotes(pollId);
  }

  @Patch(':pollId')
  @ApiOperation({ summary: 'Update a poll' })
  @ApiResponse({ status: 200, description: 'Poll updated successfully' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async update(
    @Param('pollId') pollId: string,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollService.update(pollId, updatePollDto);
  }

  @Delete(':pollId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a poll' })
  @ApiResponse({ status: 200, description: 'Poll deleted successfully' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async remove(@Param('pollId') pollId: string) {
    return this.pollService.remove(pollId);
  }
}
