import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  providers: [
    SupplierService,
    FileLoggerService,
  ],
  exports: [SupplierService],
})
export class SupplierModule {}