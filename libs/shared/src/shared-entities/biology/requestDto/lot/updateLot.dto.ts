import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologyLotDto } from '../../requestDto/lot/createLot.dto';

export class UpdateLotDto extends PartialType(CreateBiologyLotDto) {}
