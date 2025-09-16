import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StorageLocationStatus } from '@app/shared';

export class CreateStorageLocationDto {
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @IsEnum(StorageLocationStatus)
  status?: StorageLocationStatus;
}
