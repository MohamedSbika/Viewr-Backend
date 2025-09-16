import { taskPriority } from '@app/shared';
import { taskStatus } from '@app/shared';

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
