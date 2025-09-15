import { lot } from "../../ms-b/entities/lot.entity";

export class inventoryItem {
    id: string;
    name: string;
    category: string;
    unit: string;
    storageCondition: string;
    description: string;
    isConsumable: boolean;
    isReusable: boolean;
    lots: lot[];
}
