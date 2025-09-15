import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BiologyModule } from './biology/biology.module';
import { DentalModule } from './dental/dental.module';
import { ThoracicModule } from './thoracic/thoracic.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, BiologyModule, DentalModule, ThoracicModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule { }
