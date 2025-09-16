import { SafePartialType as PartialType } from '@app/shared';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
