import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { Lot } from '../../entities/lot.entity';
import { SupplierModule } from '../supplier/supplier.module';
import { FileLoggerService } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot]),
    SupplierModule,
    // LoggingModule is now available through parent InventoryModule
  ],
  controllers: [LotController],
  providers: [LotService, FileLoggerService],
  exports: [LotService],
})
export class LotModule { }
