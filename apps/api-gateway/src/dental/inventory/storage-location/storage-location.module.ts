import { Module } from '@nestjs/common';
import { StorageLocationController } from './storage-location.controller';
import { StorageLocationService } from './storage-location.service';
import { FileLoggerService } from '@app/shared';

@Module({
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
