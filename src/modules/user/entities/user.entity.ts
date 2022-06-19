import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesEnum } from '../../../core/enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  fullName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: [RolesEnum.USER],
  })
  roles: RolesEnum[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
