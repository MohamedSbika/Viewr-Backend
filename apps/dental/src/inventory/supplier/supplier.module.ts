import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../../entities/supplier.entity';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { FileLoggerService } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier]),
    // LoggingModule is now available through parent InventoryModule
  ],
  controllers: [SupplierController],
  providers: [SupplierService, FileLoggerService],
  exports: [SupplierService],
})
export class SupplierModule { }
