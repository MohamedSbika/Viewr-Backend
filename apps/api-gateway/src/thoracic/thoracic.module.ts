import { Module } from '@nestjs/common';
import { ThoracicController } from './thoracic.controller';
import { ThoracicService } from './thoracic.service';
import { microserviceProviders } from '../microservices.providers';

@Module({
  imports: [],
  controllers: [ThoracicController],
  providers: [ThoracicService,
        ...microserviceProviders
  ],
  exports: [ThoracicService],
})
export class ThoracicModule {}
