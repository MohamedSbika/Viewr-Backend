import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { ItemController } from './inventoryItem.controller';
import { InventoryItemService } from './inventoryItem.service';

@Module({
  controllers: [ItemController],
  providers: [
    InventoryItemService,
    FileLoggerService,
  ],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}