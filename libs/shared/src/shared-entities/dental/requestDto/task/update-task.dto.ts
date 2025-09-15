import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateDentalTaskDto) {}
