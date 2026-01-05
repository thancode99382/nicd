import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { User } from '../../user/entities/user.entity';

export enum TeamUserRole {
  NORMAL = 'normal',
  CAPTAIN = 'captain',
  DEPUTY_CAPTAIN = 'deputy_captain',
}

export enum TeamUserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('team_user')
export class TeamUser {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  team_user_id: string;

  @Column({ type: 'varchar', length: 255 })
  team_id: string;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({
    type: 'enum',
    enum: TeamUserRole,
    default: TeamUserRole.NORMAL,
  })
  role: TeamUserRole;

  @Column({
    type: 'enum',
    enum: TeamUserStatus,
    default: TeamUserStatus.PENDING,
  })
  status: TeamUserStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Team, (team) => team.team_users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany('TeamUserPoll', 'team_user')
  team_user_polls: any[];
}
