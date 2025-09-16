import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalTaskDto } from '@app/shared';

export class UpdateTaskDto extends PartialType(CreateDentalTaskDto) {}
