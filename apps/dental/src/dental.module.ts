import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DentalService } from './dental.service';
import { DentalController } from './dental.controller';
import { InventoryModule } from './inventory/inventory.module';
import { TaskModule } from './task/task.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DentalHealthModule } from './dental-health/dental-health.module';
import { DatabaseModule, } from '@app/shared';
import { LoggingModule } from '@app/shared/common/logging/logging.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');
        return nodeEnv === 'development'
          ? [
              {
                rootPath: join(__dirname, '..', 'public'),
                serveRoot: '/',
                exclude: ['/api*'],
              },
            ]
          : [];
      },
    }),
    InventoryModule,
    TaskModule,
    PatientModule,
    AppointmentModule,
    DentalHealthModule,
    LoggingModule,
  ],
  controllers: [DentalController],
  providers: [DentalService],
  exports: [DentalService],
})
export class DentalModule {}
