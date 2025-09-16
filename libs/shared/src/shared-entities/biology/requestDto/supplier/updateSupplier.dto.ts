import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologySupplierDto } from '../../requestDto/supplier/createSupplier.dto';

export class UpdateBiologySupplierDto extends PartialType(CreateBiologySupplierDto) {}
