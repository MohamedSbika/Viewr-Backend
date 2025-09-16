import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [InventoryItemController],
  providers: [
    InventoryItemService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}
