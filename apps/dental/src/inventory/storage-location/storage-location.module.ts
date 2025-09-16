import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageLocation } from '../../entities/storage-location.entity';
import { StorageLocationController } from './storage-location.controller';
import { StorageLocationService } from './storage-location.service';
import { FileLoggerService } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageLocation]),
    // LoggingModule is now available through parent InventoryModule
  ],
  controllers: [StorageLocationController],
  providers: [StorageLocationService, FileLoggerService],
  exports: [StorageLocationService],
})
export class StorageLocationModule {}
