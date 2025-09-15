import { PartialType } from '@nestjs/mapped-types';
import { CreateLotDto } from '../../requestDto/lot/createLot.dto';

export class UpdateLotDto extends PartialType(CreateLotDto) {}
