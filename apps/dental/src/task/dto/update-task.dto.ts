import { TaskPriority } from '../../Enums/task-priority.enum';
import { TaskStatus } from '../../Enums/task-status.enum';
import { IsOptional, IsDateString, IsString, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
