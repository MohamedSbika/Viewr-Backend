import { Module } from '@nestjs/common';
import { BiologyController } from './biology.controller';
import { BiologyService } from './biology.service';
import { DatabaseModule, EstablishmentAuth, FeatureAuth, LoggerModule, LoggingModule, PermissionAuth, PlanAuth, RedisModule, RoleAuth, RoleFeaturePermissionAuth, UserAuth, UserProfileAuth } from '@app/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  controllers: [BiologyController],
  providers: [BiologyService],
})
export class BiologyModule {}
