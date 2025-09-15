import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const microserviceProviders = [
  {
    provide: 'AUTH_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AUTH_QUEUE || 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  },
  {
    provide: 'BIOLOGY_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.BIOLOGY_QUEUE || 'biology_queue',
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  },
  {
    provide: 'THORACIC_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.THORACIC_QUEUE || 'thoracic_queue',
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  },
  {
    provide: 'DENTIST_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.DENTAL_QUEUE || 'dental_queue',
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  },
  {
    provide: 'AI_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.AI_QUEUE || 'ai_queue',
          queueOptions: {
            durable: true,
          },
        },
      });
    },
  },
];
