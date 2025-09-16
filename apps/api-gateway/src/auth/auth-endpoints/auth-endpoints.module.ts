import { Module } from '@nestjs/common';
import { AuthEndpointsController } from './auth-endpoints.controller';
import { AuthEndpointsService } from './auth-endpoints.service';
import { microserviceProviders } from '../../microservices.providers';
import { LoggerModule } from '@app/shared';

@Module({
  imports: [LoggerModule],
  controllers: [AuthEndpointsController],
  providers: [
    AuthEndpointsService,
    ...microserviceProviders.filter(provider => provider.provide === 'AUTH_SERVICE'),
  ],
  exports: [AuthEndpointsService],
})
export class AuthEndpointsModule {}
