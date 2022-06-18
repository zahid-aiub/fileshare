import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EApprovalRequest } from '../../../core/enums/approval.request.enum';

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

  @Column({
    type: 'enum',
    enum: EApprovalRequest,
    nullable: true,
  })
  approvalRequest: EApprovalRequest;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
