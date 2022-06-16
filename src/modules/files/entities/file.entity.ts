import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  hash: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ default: false })
  isBlockListed: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
