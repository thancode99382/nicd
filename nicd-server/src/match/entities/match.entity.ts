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

@Entity('match')
export class Match {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  match_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  opponent_name: string;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ type: 'varchar', length: 255 })
  team_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Team, (team) => team.matches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany('Poll', 'match')
  polls: any[];
}
