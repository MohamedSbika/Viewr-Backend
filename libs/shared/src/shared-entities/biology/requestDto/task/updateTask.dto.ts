import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologyTaskDto } from '../task/createTask.dto';

export class UpdateBiologyTaskDto extends PartialType(CreateBiologyTaskDto) {}
