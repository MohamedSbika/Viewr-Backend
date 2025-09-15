import { PartialType } from '@nestjs/mapped-types';
import { CreateDDentalLotDto } from './create-lot.dto';
import { IsOptional } from 'class-validator';

export class UpdateLotRequestDto extends PartialType(CreateDDentalLotDto) {
  @IsOptional()
  all: boolean;
}
