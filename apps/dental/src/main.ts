import { NestFactory } from '@nestjs/core';
import { DentalModule } from './dental.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { RpcValidationFilter } from '@app/shared';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(DentalModule);

  const configService = app.get(ConfigService);
  const fileLogger = app.get(FileLoggerService);

  // Récupération des variables d’environnement
  const rabbitMqUrls = configService
    .get<string>('RABBITMQ_URL', 'amqp://localhost:5672')
    .split(',');
  const rabbitMqQueue = configService.get<string>('DENTAL_QUEUE', 'dental_queue');

  // Ajout du microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: rabbitMqUrls,
      queue: rabbitMqQueue,
      queueOptions: { durable: true },
    },
  });

  // Pipes et filtres globaux
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcValidationFilter());

  // Logs
  logger.log('🚀 Starting Dental Microservice...');
  fileLogger.log('Starting Dental Microservice', 'main', 'bootstrap');

  // Démarrage du serveur HTTP + microservice
  await app.listen(3020); // Port API HTTP
  await app.startAllMicroservices();

  logger.log('✅ Dental Microservice started successfully!');
  logger.log('🦷 Ready to process dental inventory requests...');
  fileLogger.log(
    `Dental Microservice is listening to ${rabbitMqUrls.join(', ')} on queue ${rabbitMqQueue}`,
    'main',
    'bootstrap',
  );
}

bootstrap();
