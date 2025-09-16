import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcValidationFilter } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Auth Microservice');

  // Vérifier/Créer le dossier de logs
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.log('Created logs directory');
  }

  try {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);

    // Récupérer les infos RabbitMQ depuis .env
    const rabbitMqUrls = configService.get<string>('RABBITMQ_URLS', 'amqp://localhost:5672').split(',');
    const rabbitMqQueue = configService.get<string>('RABBITMQ_QUEUE', 'auth_queue');

    // Connecter le microservice RMQ
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: rabbitMqUrls,
        queue: rabbitMqQueue,
        queueOptions: { durable: true },
      },
    });

    // Ajouter ValidationPipe et RpcValidationFilter globalement
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new RpcValidationFilter());

    // Lancer microservices et app
    await app.startAllMicroservices();
    await app.listen(3010);

    console.log("✅ Microservice Auth est en cours d'exécution");
  } catch (error) {
    logger.error(`❌ Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
