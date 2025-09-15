import { taskStatus } from '@app/shared';
import { taskPriority } from '@app/shared';

export class taskResponseDto {
  id: string;
  title: string;
  description: string;
  taskStatus: taskStatus;
  taskPriority: taskPriority;
  deadline: Date;
  completedAt: Date;
}
