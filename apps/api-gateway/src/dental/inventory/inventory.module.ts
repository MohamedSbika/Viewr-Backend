import { forwardRef, Module } from '@nestjs/common';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { LotModule } from './lot/lot.module';
import { SupplierModule } from './supplier/supplier.module';
import { StorageLocationModule } from './storage-location/storage-location.module';
import { TransactionModule } from './transaction/transaction.module';
import { DentalModule } from '../dental.module';

@Module({
  imports: [
    forwardRef(() => DentalModule),
    InventoryItemModule,
    LotModule,
    SupplierModule,
    StorageLocationModule,
    TransactionModule,
  ],
  exports: [
    InventoryItemModule,
    LotModule,
    SupplierModule,
    StorageLocationModule,
    TransactionModule,
  ],
})
export class InventoryModule {}
