import { LotStatus } from '@app/shared';

export class LotResponseDentalDto {
  id: string;
  inventoryItemId: string;
  supplierId: string;
  storageLocationId: string;
  receiveDate: Date;
  expiryDate: Date;
  quantity: number;
  lastCheckedDate: Date;
  lastUsedDate: Date;
  status: LotStatus;
  location: string;
  createdAt: Date;
  updatedAt: Date;

  inventoryItem?: {
    id: string;
    name: string;
    category: string;
  };

  supplier?: {
    id: string;
    name: string;
  };

  storageLocation?: {
    id: string;
    locationName: string;
  };
}
