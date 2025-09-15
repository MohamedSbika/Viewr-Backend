import { InventoryItemCategory } from '../../Enums/inventory/inventory-item-category.enum';
import { StorageCondition } from '../../Enums/inventory/storage-condition.enum';
import { Lot } from './lot.entity';
import { Transaction } from './transaction.entity';

export class InventoryItem {
  id: string;
  name: string;
  category: InventoryItemCategory;
  unit: string;
  storageCondition: StorageCondition;
  description: string;
  isConsumable: boolean;
  isReusable: boolean;
  lots: Lot[];
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}
