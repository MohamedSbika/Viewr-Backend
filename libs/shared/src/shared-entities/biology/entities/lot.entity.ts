import { inventoryItem } from "./inventoryItem.entity";
import { Transaction } from "@app/shared";
import { supplier } from "@app/shared";
import { storageLocation } from "../entities/storageLocation.entity";
import { lotStatus } from "@app/shared";

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