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

@Entity('conversation_user')
export class ConversationUser {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  conversation_user_id: string;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  conversation_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.conversation_users,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
