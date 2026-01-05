import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  team_id: string;

  @Column({ type: 'varchar', length: 255 })
  team_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color_jersey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  level: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany('TeamUser', 'team')
  team_users: any[];

  @OneToMany('Match', 'team')
  matches: any[];
}
