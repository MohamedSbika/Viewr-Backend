import { lot } from "@app/shared";

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
