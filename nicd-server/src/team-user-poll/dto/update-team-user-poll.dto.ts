import { PartialType } from '@nestjs/swagger';
import { CreateTeamUserPollDto } from './create-team-user-poll.dto';

export class UpdateTeamUserPollDto extends PartialType(CreateTeamUserPollDto) {}
