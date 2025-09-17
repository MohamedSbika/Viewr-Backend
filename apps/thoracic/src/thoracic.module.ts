import { Module } from '@nestjs/common';
import { ThoracicController } from './thoracic.controller';
import { ThoracicService } from './thoracic.service';
import { UserAuth, RoleAuth, PermissionAuth, UserProfileAuth, FeatureAuth, RoleFeaturePermissionAuth,EstablishmentAuth, PlanAuth } from '@app/shared/auth-entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule, LoggerModule, LoggingModule, RedisModule } from '@app/shared';

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
  controllers: [ThoracicController],
  providers: [ThoracicService],
})
export class ThoracicModule {}
