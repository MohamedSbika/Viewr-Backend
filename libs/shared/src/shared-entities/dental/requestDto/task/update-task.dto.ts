import {  taskPriority, taskStatus } from '@app/shared';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
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
