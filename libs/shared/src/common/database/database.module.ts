import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EstablishmentAuth, FeatureAuth, PermissionAuth, PlanAuth, RoleAuth, RoleFeaturePermissionAuth, UserAuth, UserProfileAuth } from '@app/shared/auth-entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          UserAuth,
          RoleAuth,
          PermissionAuth,
          UserProfileAuth,
          FeatureAuth,
          RoleFeaturePermissionAuth,
          EstablishmentAuth,
          PlanAuth
        ], synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
