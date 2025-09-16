import { InventoryItemCategory } from '@app/shared';
import { StorageCondition } from '@app/shared';
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
