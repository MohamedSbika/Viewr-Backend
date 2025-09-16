import { SafePartialType as PartialType } from '@app/shared';
import { CreateLotDto } from './create-lot.dto';
import { IsOptional } from 'class-validator';

export class UpdateLotDto extends PartialType(CreateLotDto) {
  @IsOptional()
  all: boolean;
}
