import { StorageLocationStatus } from '@app/shared';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDentalStorageLocationDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    locationName: string;

    @IsOptional()
    @IsEnum(StorageLocationStatus)
    status?: StorageLocationStatus;
}
