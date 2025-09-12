import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { BiologyModule } from './biology/biology.module';
import { DentalModule } from './dental/dental.module';
import { ThoracicModule } from './thoracic/thoracic.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, BiologyModule, DentalModule, ThoracicModule, NotificationModule],
  controllers: [ApiGatewayController, AuthController],
  providers: [ApiGatewayService, AuthService],
})
export class ApiGatewayModule {}
