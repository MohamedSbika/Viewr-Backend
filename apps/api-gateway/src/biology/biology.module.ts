import { Module } from '@nestjs/common';
import { BiologyController } from './biology.controller';
import { BiologyService } from './biology.service';

@Module({
  controllers: [BiologyController],
  providers: [BiologyService]
})
export class BiologyModule {}
