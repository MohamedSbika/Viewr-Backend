import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologyStorageLocationDto } from '../../requestDto/storageLocation/createStorage.dto';

export class UpdateBiologyStorageLocationDto extends PartialType(CreateBiologyStorageLocationDto) {}
