import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Message } from './Message';
import { User } from './User';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @ManyToMany('User')
    @JoinTable({
        name: 'room_users',
        joinColumn: { name: 'room_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    users!: User[];

    @OneToMany('Message', 'room')
    messages!: Message[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 