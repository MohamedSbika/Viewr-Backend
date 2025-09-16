import { forwardRef, Module } from '@nestjs/common';
import { StorageLocationController } from './storage-location.controller';
import { StorageLocationService } from './storage-location.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
  controllers: [StorageLocationController],
  providers: [
    StorageLocationService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [StorageLocationService],
})
export class StorageLocationModule {}
