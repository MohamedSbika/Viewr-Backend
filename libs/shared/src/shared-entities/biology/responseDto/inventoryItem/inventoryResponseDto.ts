export class InventoryItemBiologyResponseDto {
    id: string;
    name: string;
    category: string;
    unit: string;
    storageCondition: string;
    description: string;
    isConsumable: boolean;
    isReusable:boolean;
  
    // You can optionally include related lots here
    lots?: {
      id: string;
      quantity: number;
      lotStatus: string;
      // add more fields if needed
    }[];
  }
  