export class StorageLocationBiologyResponseDto {
    id: string;
    locationName: string;
  
    lots?: {
      id: string;
      receivedDate: Date;
      expiryDate: Date;
      quantity: number;
      lotStatus: string;
    }[];
  }
  