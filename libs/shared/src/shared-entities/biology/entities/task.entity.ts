import { taskPriority } from '@app/shared';
import { taskStatus } from '@app/shared';

export class BiologyTask {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    completedAt: Date;
    priority: taskPriority;
    status: taskStatus;
}