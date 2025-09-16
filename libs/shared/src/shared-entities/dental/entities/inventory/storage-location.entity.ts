import { StorageLocationStatus } from '@app/shared';

export class StorageLocation {
  id: string;
  locationName: string;
  status: StorageLocationStatus;
  createdAt: Date;
  updatedAt: Date;
}
