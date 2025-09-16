import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StorageLocationStatus } from '@app/shared';

export class UpdateStorageLocationDto {
  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsEnum(StorageLocationStatus)
  status?: StorageLocationStatus;
}
