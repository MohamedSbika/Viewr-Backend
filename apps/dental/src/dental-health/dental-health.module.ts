import { Module } from '@nestjs/common';
import { DentalHealthController } from './dental-health.controller';
import { LoggingModule } from '@app/shared/common/logging/logging.module';

@Module({
  imports: [
    LoggingModule
  ],
  controllers: [DentalHealthController],
})
export class DentalHealthModule {}
