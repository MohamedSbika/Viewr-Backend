import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyStorageLocationDto } from '../../requestDto/storageLocation/createStorage.dto';

export class UpdateBiologyStorageLocationDto extends PartialType(CreateBiologyStorageLocationDto) {}
