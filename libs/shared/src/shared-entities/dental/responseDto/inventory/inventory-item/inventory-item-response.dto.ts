import { InventoryItemCategory } from '@app/shared';
import { StorageCondition } from '@app/shared';

export class InventoryItemDentalResponseDto {
  id: string;
  name: string;
  category: InventoryItemCategory;
  unit: string;
  storageCondition: StorageCondition;
  description: string;
  isConsumable: boolean;
  isReusable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
