import {Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

export class CreatedEntity {

    @Column()
    by: number;

    @CreateDateColumn({type: 'timestamp'})
    at:Date;
}

export class UpdatedEntity {

    @Column({ default:0})
    by: number;

    @UpdateDateColumn({ type: 'timestamp'})
    at:Date;
}

export class DeletedEntity {

    @Column({ default:0})
    by: number;

    @DeleteDateColumn({ type: 'timestamp'})
    at:Date;
}