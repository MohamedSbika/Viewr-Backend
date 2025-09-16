import { IsOptional, IsString } from 'class-validator';

export class UpdateBiologyStorageLocationDto  {
      @IsString()
      @IsOptional()
      locationName: string;
}
