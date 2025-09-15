import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Auth Microservice');

  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.log('Created logs directory');
  }

  try {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);

    // Get environment variables using ConfigService
    const rabbitMqUrls = configService.get('RABBITMQ_URLS', 'amqp://localhost:5672').split(',');
    const rabbitMqQueue = configService.get('RABBITMQ_QUEUE', 'auth_queue');


    // Start microservice listener
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: rabbitMqUrls,
        queue: rabbitMqQueue,
        queueOptions: { durable: true },
      },
    });

    await app.listen(3010);
    await app.startAllMicroservices();

    console.log('Microservice Auth est en cours d\'exécution');
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
