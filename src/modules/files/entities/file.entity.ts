import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EApprovalRequest } from '../../../core/enums/approval.request.enum';
import {type} from "os";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  hash: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ default: false })
  isBlockListed: boolean;

  @Column({
    type: 'enum',
    enum: EApprovalRequest,
    nullable: true,
  })
  approvalRequest: EApprovalRequest;

  @Column({ type: 'date', nullable: true })
  lastDownloadedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
