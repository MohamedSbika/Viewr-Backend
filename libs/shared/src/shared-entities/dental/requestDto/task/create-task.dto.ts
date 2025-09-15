import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { taskStatus } from '@app/shared';
import { taskPriority } from '@app/shared';

export class CreateDentalTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(taskStatus)
  @IsOptional()
  taskStatus?: taskStatus;

  @IsEnum(taskPriority)
  @IsOptional()
  taskPriority?: taskPriority;

  @IsDateString()
  deadline: Date;

  @IsDateString()
  completedAt: Date;
}
