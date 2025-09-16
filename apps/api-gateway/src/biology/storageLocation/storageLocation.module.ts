import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { StorageController } from './storageLocation.controller';
import { StorageService } from './storageLocation.service';

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    FileLoggerService,
  ],
  exports: [StorageService],
})
export class StorageModule {}