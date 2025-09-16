import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { BiologyModule } from './biology/biology.module';
import { DentalModule } from './dental/dental.module';
import { ThoracicModule } from './thoracic/thoracic.module';
import { NotificationModule } from './notification/notification.module';
import { LoggerModule } from '@app/shared';
import { ServicesModule } from '@app/shared';

import { microserviceProviders } from './microservices.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,
    }]),

    LoggerModule,
    ServicesModule,
    AuthModule,
    BiologyModule,
    DentalModule,
    ThoracicModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [...microserviceProviders],
  exports: [...microserviceProviders], 
})
export class ApiGatewayModule {}
