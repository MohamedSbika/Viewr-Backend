import { NestFactory } from '@nestjs/core';
import { ThoracicModule } from './thoracic.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileLoggerService, RpcValidationFilter } from '@app/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(ThoracicModule);

  const configService = app.get(ConfigService);
  const fileLogger = app.get(FileLoggerService);  

  // Récupération des variables d’environnement
  const rabbitMqUrls = configService
    .get<string>('RABBITMQ_URLS', 'amqp://localhost:5672')
    .split(',');
  const rabbitMqQueue = configService.get<string>('RABBITMQ_QUEUE', 'notification_queue');

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
  logger.log('🚀 Starting Thoracic Microservice...');
  fileLogger.log('Starting Thoracic Microservice', 'main', 'bootstrap');

  // Démarrage du serveur HTTP + microservice
  await app.listen(3050); // Port API HTTP
  await app.startAllMicroservices();

  logger.log('✅ Thoracic Microservice started successfully!');
  logger.log(' Ready to process Thoracic  requests...');
  fileLogger.log(
    `Dental Microservice is listening to ${rabbitMqUrls.join(', ')} on queue ${rabbitMqQueue}`,
    'main',
    'bootstrap',
  );
}
bootstrap();
