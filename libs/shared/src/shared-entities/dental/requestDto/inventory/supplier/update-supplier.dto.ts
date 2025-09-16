import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateDentalSupplierDto) {}
