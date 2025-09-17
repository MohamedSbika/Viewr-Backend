import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DatabaseModule, EstablishmentAuth, FeatureAuth, LoggerModule, LoggingModule, PermissionAuth, PlanAuth, RedisModule, RoleAuth, RoleFeaturePermissionAuth, UserProfileAuth } from '@app/shared';
import { UserAuth } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
        LoggerModule,  
        DatabaseModule,
      ConfigModule,
      TypeOrmModule.forFeature([UserAuth, RoleAuth, PermissionAuth, UserProfileAuth, FeatureAuth, RoleFeaturePermissionAuth,EstablishmentAuth,PlanAuth]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRY', '1h') },
        }),
        inject: [ConfigService],
      }),
      RedisModule,
      LoggingModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
