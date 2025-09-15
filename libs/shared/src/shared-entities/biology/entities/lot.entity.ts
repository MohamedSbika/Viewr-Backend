import { inventoryItem } from "./inventoryItem.entity";
import { Transaction } from "../entities/transaction.entity";
import { supplier } from "../entities/supplier.entity";
import { storageLocation } from "../entities/storageLocation.entity";
import { lotStatus } from "../Enums/lotStatus.enum";

export class lot {
    id: string;
    receivedDate: Date;
    expiryDate: Date;
    quantity: number;    lastChecked: Date;
    status: lotStatus;
    inventoryItem: inventoryItem;
    transactions: Transaction[];
    supplier: supplier;
    storageLocation: storageLocation;
}