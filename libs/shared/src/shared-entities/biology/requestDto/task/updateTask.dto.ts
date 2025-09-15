import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyTaskDto } from '../task/createTask.dto';

export class UpdateBiologyTaskDto extends PartialType(CreateBiologyTaskDto) {}
