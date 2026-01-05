import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConversationUser } from '../../conversation-user/entities/conversation-user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  conversation_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  conversation_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  team_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(
    () => ConversationUser,
    (conversationUser) => conversationUser.conversation,
  )
  conversation_users: ConversationUser[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
