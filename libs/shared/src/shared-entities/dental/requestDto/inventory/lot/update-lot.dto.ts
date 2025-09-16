import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalLotDto } from './create-lot.dto';
import { IsOptional } from 'class-validator';

export class UpdateLotRequestDto extends PartialType(CreateDentalLotDto) {
  @IsOptional()
  all: boolean;
}
