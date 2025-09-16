import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FeatureModule } from './feature/feature.module';
import { EstablishmentModule } from './establishment/establishment.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthEndpointsModule } from './auth-endpoints/auth-endpoints.module';
import { microserviceProviders } from '../microservices.providers';


@Module({
  imports: [
    FeatureModule, 
    EstablishmentModule, 
    RoleModule, 
    PermissionModule,
    AuthEndpointsModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...microserviceProviders
  ],
  exports: [AuthService, AuthEndpointsModule,
        ...microserviceProviders,
  ],
})
export class AuthModule {}
