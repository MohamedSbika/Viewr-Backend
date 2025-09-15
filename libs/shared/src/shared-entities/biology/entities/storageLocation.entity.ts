import { lot } from "./lot.entity";

export class storageLocation {
    id: string;
    locationName: string;
    lots: lot[];
}