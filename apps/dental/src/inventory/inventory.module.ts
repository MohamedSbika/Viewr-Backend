import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { StorageLocationModule } from './storage-location/storage-location.module';
import { LotModule } from './lot/lot.module';
import { SupplierModule } from './supplier/supplier.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    // LoggingModule is now global, so no need to import it here
    StorageLocationModule,
    LotModule,
    SupplierModule,
    InventoryItemModule,
    TransactionModule, // Uncommented since you want all submodules
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService], // No need to export LoggingModule anymore since it's global
})
export class InventoryModule {}
