import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StorageLocationStatus } from '@app/shared';

export class CreateDentalStorageLocationDto {
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @IsEnum(StorageLocationStatus)
  status?: StorageLocationStatus;
}
