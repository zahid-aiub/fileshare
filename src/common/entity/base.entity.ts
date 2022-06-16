import {Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

export abstract class BaseEntity {

    @Column()
    createdBy: number;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt:Date

    @Column({ default:0})
    updatedBy: number;

    @UpdateDateColumn({ type: 'timestamp'})
    updatedAt:Date

    @Column({ default:0})
    deletedBy: number;

    @DeleteDateColumn({ type: 'timestamp'})
    deletedAt:Date
}