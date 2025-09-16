import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth, RoleAuth, PermissionAuth, UserProfileAuth, FeatureAuth, RoleFeaturePermissionAuth,EstablishmentAuth } from '@app/shared';
import { RedisModule } from '@app/shared';
import { LoggingModule } from './logging/logging.module';
import { EmailService } from '@app/shared';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserAuth, RoleAuth, PermissionAuth, UserProfileAuth, FeatureAuth, RoleFeaturePermissionAuth,EstablishmentAuth]),
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
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
