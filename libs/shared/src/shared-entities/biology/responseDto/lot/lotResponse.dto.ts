import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyLotDto } from '../../requestDto/lot/createLot.dto';
import { lotStatus } from '@app/shared';

export class UpdateLotResponseDto extends PartialType(CreateBiologyLotDto) {}
export class LotBiologyResponseDto {
    id: string;
    receivedDate: Date;
    expiryDate: Date;
    quantity: number;
    lastChecked: Date;
    status: lotStatus;
  
    inventoryItem: {
      id: string;
      name: string;
      category: string;
    };
  
    supplier: {
      id: string;
      name: string;
      // Add more fields if needed
    };
  
    storageLocation: {
      id: string;
      name: string;
      // Add more fields if needed
    };
  
    transactions?: {
      id: string;
      transactionDate: Date;
      transactionQuantity: number;
      transactionType: string;
    }[];
  }
  