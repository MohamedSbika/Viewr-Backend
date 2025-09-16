import { TransactionType } from '@app/shared';
import { InventoryItem } from './inventory-item.entity';

export class Transaction {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  date: Date;
  type: TransactionType;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
