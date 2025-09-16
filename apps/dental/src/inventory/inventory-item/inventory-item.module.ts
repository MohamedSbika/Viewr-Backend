import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { Lot } from '../../entities/lot.entity';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { FileLoggerService } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Lot]),
    // LoggingModule is now available through parent InventoryModule
  ],
  controllers: [InventoryItemController],
  providers: [InventoryItemService, FileLoggerService],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}
