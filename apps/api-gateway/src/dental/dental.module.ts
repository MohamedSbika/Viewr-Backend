import { Module } from '@nestjs/common';
import { DentalController } from './dental.controller';
import { DentalService } from './dental.service';
import { InventoryModule } from './inventory/inventory.module';
import { TaskModule } from './task/task.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { FileLoggerService } from '@app/shared';
import { microserviceProviders } from '../microservices.providers';

@Module({
  imports: [
    InventoryModule,
    TaskModule,
    PatientModule,
    AppointmentModule,
  ],
  controllers: [DentalController],
  providers: [
    DentalService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
        ...microserviceProviders
  ],
  exports: [DentalService, InventoryModule, TaskModule, PatientModule, AppointmentModule ,
        ...microserviceProviders,   // <-- Et exporte ici

  ],
})
export class DentalModule {}
