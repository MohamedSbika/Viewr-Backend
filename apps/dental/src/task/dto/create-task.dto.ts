import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TaskPriority } from '../../Enums/task-priority.enum';
import { TaskStatus } from '../../Enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsString()
  userId: string;
}
