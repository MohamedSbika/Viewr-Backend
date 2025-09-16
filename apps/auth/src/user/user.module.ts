import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAuth , UserProfileAuth, RoleAuth, EstablishmentAuth } from '@app/shared';
import { FileLoggerService } from '../logging/file-logger.service';
import { RedisModule } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuth, UserProfileAuth, RoleAuth, EstablishmentAuth]),
    RedisModule
  ],
  controllers: [UserController],
  providers: [UserService, FileLoggerService],
  exports: [UserService]
})
export class UserModule {}
