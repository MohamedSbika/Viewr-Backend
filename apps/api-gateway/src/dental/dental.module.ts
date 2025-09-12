import { Module } from '@nestjs/common';
import { DentalService } from './dental.service';
import { DentalController } from './dental.controller';

@Module({
  providers: [DentalService],
  controllers: [DentalController]
})
export class DentalModule {}
