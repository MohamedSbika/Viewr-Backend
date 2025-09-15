import { TransactionType } from '@app/shared';

export class TransactionResponseDto {
  id: string;
  inventoryItemId: string;
  date: Date;
  type: TransactionType;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  inventoryItem?: {
    id: string;
    name: string;
  };
}
