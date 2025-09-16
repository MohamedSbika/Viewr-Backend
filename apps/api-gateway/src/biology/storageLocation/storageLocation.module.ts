import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { StorageController } from './storageLocation.controller';
import { StorageService } from './storageLocation.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [StorageController],
  providers: [
    StorageService,
    FileLoggerService,
  ],
  exports: [StorageService],
})
export class StorageModule {}