import { transactionType } from '@app/shared';

export class TransactionBiologyResponseDto {
  id: string;
  transactionDate: Date;
  transactionQuantity: number;
  notes: string;
  transaction: transactionType;

  lot: {
    id: string;
    quantity: number;
    lotStatus: string;
    // Add more fields if necessary
  };
}
