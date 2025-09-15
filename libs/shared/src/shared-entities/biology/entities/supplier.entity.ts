import { lot } from "./lot.entity";

export class supplier {
    id: string;
    supplierName: string;
    contactPersonName: string;
    phone: string;
    email: string;
    adress: string;
    lots: lot[];
}
