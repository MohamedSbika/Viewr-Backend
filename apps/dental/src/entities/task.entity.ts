import { TaskPriority } from '../Enums/task-priority.enum';
import { TaskStatus } from '../Enums/task-status.enum';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('task')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    deadline: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TO_DO,
    })
    status: TaskStatus;

    @Column()
    userId: string; // User attribute to link task to a user

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
