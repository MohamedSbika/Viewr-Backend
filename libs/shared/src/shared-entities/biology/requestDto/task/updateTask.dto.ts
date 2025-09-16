import { taskStatus, taskPriority } from '@app/shared';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { CreateBiologyTaskDto } from '../task/createTask.dto';

export class UpdateBiologyTaskDto  {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description: string;

    @IsEnum(taskStatus)
    @IsOptional()
    taskStatus?: taskStatus;

    @IsEnum(taskPriority)
    @IsOptional()
    taskPriority?: taskPriority;

    @IsOptional()
    @IsDateString()
    deadline: Date;

    @IsOptional()
    @IsDateString()
    completedAt: Date;
}
