import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SocialLink } from '../../social-links/entities/social-link.entity';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true })
  verification_code: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_expires_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refresh_token_hash: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  introduce: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jersey_number: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => SocialLink, (socialLink) => socialLink.user)
  social_links: SocialLink[];
}
