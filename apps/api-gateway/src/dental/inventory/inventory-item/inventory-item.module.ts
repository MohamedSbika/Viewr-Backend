import { forwardRef, Module } from '@nestjs/common';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
  
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
