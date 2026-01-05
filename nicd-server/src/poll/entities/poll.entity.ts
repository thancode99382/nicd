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

@Entity('poll')
export class Poll {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  poll_id: string;

  @Column({ type: 'text' })
  poll_content: string;

  @Column({ type: 'varchar', length: 255 })
  match_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne('Match', 'polls', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  match: any;

  @OneToMany('TeamUserPoll', 'poll')
  votes: any[];
}
