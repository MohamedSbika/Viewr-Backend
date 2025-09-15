import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PartialType(
  CreateDentalInventoryItemDto,
) {}
