import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalStorageLocationDto } from './create-storage-location.dto';

export class UpdateStorageLocationDto extends PartialType(CreateDentalStorageLocationDto) {}
