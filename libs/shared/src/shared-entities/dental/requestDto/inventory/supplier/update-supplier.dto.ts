import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateDentalSupplierDto) {}
