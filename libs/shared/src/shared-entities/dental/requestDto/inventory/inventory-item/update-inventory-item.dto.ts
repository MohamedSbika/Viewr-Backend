import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PartialType(
  CreateDentalInventoryItemDto,
) {}
