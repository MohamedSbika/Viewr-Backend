import { StorageLocationStatus } from '../../Enums/inventory/storage-location-status.enum';

export class StorageLocation {
  id: string;
  locationName: string;
  status: StorageLocationStatus;
  createdAt: Date;
  updatedAt: Date;
}
