import { forwardRef, Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
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
