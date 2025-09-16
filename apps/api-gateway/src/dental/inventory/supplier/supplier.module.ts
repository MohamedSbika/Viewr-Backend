import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [SupplierController],
  providers: [
    SupplierService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [SupplierService],
})
export class SupplierModule {}
