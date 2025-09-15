import { taskPriority } from '../Enums/task/task-priority.enum';
import { taskStatus } from '../Enums/task/task-status.enum';

export class Task {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    completedAt: Date;
    priority: taskPriority;
    status: taskStatus;
    userId: string; // User attribute to link task to a user    createdAt: Date;
}
