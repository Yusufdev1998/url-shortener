import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Click } from './click.entity';

@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  alias: string;

  @Column()
  originalUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => Click, (click) => click.shortUrl)
  clicks: Click[];
}
