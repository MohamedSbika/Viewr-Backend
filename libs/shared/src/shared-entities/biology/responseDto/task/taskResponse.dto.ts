import { taskStatus } from '@app/shared';
import { taskPriority } from '@app/shared';

export class taskBiologyResponseDto {
  id: string;
  title: string;
  description: string;
  taskStatus: taskStatus;
  taskPriority: taskPriority;
  deadline: Date;
  completedAt: Date;
}
