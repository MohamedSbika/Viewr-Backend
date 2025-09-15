import { IsString } from 'class-validator';

export class CreateBiologyStorageLocationDto {
  @IsString()
  locationName: string;
}
