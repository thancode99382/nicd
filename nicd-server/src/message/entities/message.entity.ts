import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from '../../conversation/entities/conversation.entity';

@Entity('message')
export class Message {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  message_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  conversation_id: string;

  @Column({ type: 'varchar', length: 255 })
  sender_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
