import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { ItemController } from './inventoryItem.controller';
import { InventoryItemService } from './inventoryItem.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [ItemController],
  providers: [
    InventoryItemService,
    FileLoggerService,
  ],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}