import { Module } from '@nestjs/common';
import { IpBanService } from './ip-ban.service';
import { IpBanGuard } from './ip-ban.guard';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    IpBanService,
    IpBanGuard,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IpBanGuard,
    }
  ],
  exports: [IpBanService, IpBanGuard],
})
export class SecurityModule {}