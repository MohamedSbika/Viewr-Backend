export class SupplierBiologyResponseDto {
    id: string;
    supplierName: string;
    contactPersonName: string;
    phone: string;
    email: string;
    adress: string;
  
    lots?: {
      id: string;
      receivedDate: Date;
      expiryDate: Date;
      quantity: number;
      lotStatus: string;
    }[];
  }
  