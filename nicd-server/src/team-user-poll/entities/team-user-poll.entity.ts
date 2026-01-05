import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('team_user_poll')
export class TeamUserPoll {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  team_user_poll_id: string;

  @Column({ type: 'varchar', length: 255 })
  poll_id: string;

  @Column({ type: 'varchar', length: 255 })
  team_user_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne('Poll', 'votes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: any;

  @ManyToOne('TeamUser', 'team_user_polls', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_user_id' })
  team_user: any;
}
