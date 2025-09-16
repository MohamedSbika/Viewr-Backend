import { Module } from '@nestjs/common';
import { ThoracicController } from './thoracic.controller';
import { ThoracicService } from './thoracic.service';

@Module({
  imports: [],
  controllers: [ThoracicController],
  providers: [ThoracicService],
  exports: [ThoracicService],
})
export class ThoracicModule {}
