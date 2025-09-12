import { Module } from '@nestjs/common';
import { ThoracicController } from './thoracic.controller';
import { ThoracicService } from './thoracic.service';

@Module({
  controllers: [ThoracicController],
  providers: [ThoracicService]
})
export class ThoracicModule {}
