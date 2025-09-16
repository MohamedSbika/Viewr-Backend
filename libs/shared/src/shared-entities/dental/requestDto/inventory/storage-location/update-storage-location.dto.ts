import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalStorageLocationDto } from './create-storage-location.dto';

export class UpdateDentalStorageLocationDto extends PartialType(CreateDentalStorageLocationDto) {}
