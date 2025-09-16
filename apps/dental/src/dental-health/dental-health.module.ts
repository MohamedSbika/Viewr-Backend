import { Module } from '@nestjs/common';
import { DentalHealthController } from './dental-health.controller';

@Module({
  controllers: [DentalHealthController],
})
export class DentalHealthModule {}
