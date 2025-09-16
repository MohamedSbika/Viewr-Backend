import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    FileLoggerService,
  ],
  exports: [SupplierService],
})
export class SupplierModule {}