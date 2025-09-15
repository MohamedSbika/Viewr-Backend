import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { taskPriority } from '@app/shared';
import { taskStatus } from '@app/shared';

export class TaskResponseDto {
  title: string;
  description: string;
  deadline: string;
  priority: taskPriority;
  status?: taskStatus;
  userId: string;
}
