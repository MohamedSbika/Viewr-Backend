import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologySupplierDto } from '../../requestDto/supplier/createSupplier.dto';

export class UpdateBiologySupplierDto extends PartialType(CreateBiologySupplierDto) {}
