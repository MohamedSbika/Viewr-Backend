import { Global, Module } from '@nestjs/common';
import { FileLoggerService1 } from './file-logger.service';
import { LoggerConfig } from './logger.config';

@Global()
@Module({
  providers: [
    FileLoggerService1,
    {
      provide: 'LOGGER_CONFIG',
      useValue: LoggerConfig,
    },
  ],
  exports: [FileLoggerService1, 'LOGGER_CONFIG'],
})
export class LoggingModule {}
