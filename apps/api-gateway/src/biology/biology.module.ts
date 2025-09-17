import { TransactionModule } from './transaction/transaction.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BiologyController } from './biology.controller';
import { BiologyService } from './biology.service';
import { PatientModule } from './patient/patient.module';
import { AppointementModule } from './appointement/appointement.module';
import { AnalysisModule } from './analysis/analysis.module';
import { taskModule } from './task/task.module';
import { appointmentTestModule } from './appointmentTest/appointmentTest.module';
import { paymentModule } from './payment/payment.module';
import { InventoryItemModule } from './inventoryItem/inventoryItem.module';
import { StorageModule } from './storageLocation/storageLocation.module';
import { LotModule } from './Lot/lot.module';
import { SupplierModule } from './supplier/supplier.module';
import { microserviceProviders } from '../microservices.providers';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
    ClientsModule.register([
      {
        name: 'BIOLOGY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'biology_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    PatientModule,
    AppointementModule,
    AnalysisModule,
    taskModule,
    appointmentTestModule,
    paymentModule,
    InventoryItemModule,
    StorageModule,
    LotModule,
    SupplierModule,
    TransactionModule
  ],
  controllers: [BiologyController],
  providers: [BiologyService,    ...microserviceProviders],
  exports: [BiologyService,    ...microserviceProviders],
})
export class BiologyModule {}
