import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { FileLoggerService } from './file-logger.service';
import { LoggerInterceptor } from './logger.interceptor';
import { RequestLoggerMiddleware } from './request-logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  providers: [
    FileLoggerService,
    {
      provide: 'FileLogger',
      useExisting: FileLoggerService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [
    FileLoggerService,
    'FileLogger',
  ],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the request logger middleware to all routes
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}