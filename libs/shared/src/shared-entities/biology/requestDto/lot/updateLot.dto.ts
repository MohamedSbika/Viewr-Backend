import { lotStatus } from "@app/shared";
import { IsDateString, IsDecimal, IsEnum, IsOptional, IsUUID } from "class-validator";

export class UpdateLotDto {
    @IsOptional()
    @IsDateString()
    receivedDate: Date;

    @IsOptional()
    @IsDateString()
    expiryDate: Date;

    @IsOptional()
    @IsDecimal()
    quantity: number;

    @IsOptional()
    @IsDateString()
    lastChecked: Date;

    @IsOptional()
    @IsEnum(lotStatus)
    status: lotStatus;

    @IsOptional()
    @IsUUID()
    inventoryItemId: string;

    @IsOptional()
    @IsUUID()
    supplierId: string;

    @IsOptional()
    @IsUUID()
    storageLocationId: string;
}
