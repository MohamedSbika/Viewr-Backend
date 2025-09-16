import { lot } from "@app/shared";
import { transactionType } from "@app/shared";

export class BiologyTransaction {
    id: string;
    transactionDate: Date;
    transactionQuantity: number;
    notes: string;
    transaction: transactionType;
    lot: lot;
}
