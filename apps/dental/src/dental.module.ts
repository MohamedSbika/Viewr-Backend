import { Module } from '@nestjs/common';
import { DentalController } from './dental.controller';
import { DentalService } from './dental.service';

@Module({
  imports: [],
  controllers: [DentalController],
  providers: [DentalService],
})
export class DentalModule {}
