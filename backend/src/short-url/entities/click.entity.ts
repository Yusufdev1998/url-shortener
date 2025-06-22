import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ShortUrl } from './short-url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.clicks, {
    onDelete: 'CASCADE',
  })
  shortUrl: ShortUrl;

  @CreateDateColumn()
  clickedAt: Date;

  @Column()
  ip: string;
}
