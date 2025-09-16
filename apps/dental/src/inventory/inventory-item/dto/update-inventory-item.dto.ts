import { SafePartialType as PartialType } from '@app/shared';
import { CreateInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {}
