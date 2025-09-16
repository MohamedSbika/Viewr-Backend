import { LotStatus } from '@app/shared';
import { StorageLocation } from './storage-location.entity';
import { Supplier } from './supplier.entity';
import { InventoryItem } from './inventory-item.entity';

export class Lot {
  id: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  supplierId: string;
  supplier: Supplier;
  storageLocationId: string;
  storageLocation: StorageLocation;
  receiveDate: Date;
  expiryDate: Date;
  quantity: number;
  lastCheckedDate: Date;
  lastUsedDate: Date;
  status: LotStatus;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
