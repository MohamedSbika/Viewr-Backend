import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FileLoggerService,
  ],
  exports: [FeatureService],
})
export class FeatureModule {}