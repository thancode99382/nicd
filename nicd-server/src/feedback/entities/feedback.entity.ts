import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('feedback')
export class Feedback {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  feedback_id: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
