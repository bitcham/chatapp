import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , JoinColumn} from "typeorm";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    text!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp!: Date;

    @ManyToOne('User', 'messages', { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user!: any;

    @Column({type: 'uuid'})
    userId!: string;

    @ManyToOne('Room', 'messages', { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'room_id' })
    room!: any;

    @Column({type: 'uuid'})
    roomId!: string;

    @Column({ nullable: true, select: false})
    username?: string;
    
}
