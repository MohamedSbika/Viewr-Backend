import { StorageLocationStatus } from '@app/shared';

export class StorageLocationResponseDto {
  id: string;
  locationName: string;
  status: StorageLocationStatus;
  createdAt: Date;
  updatedAt: Date;
}
