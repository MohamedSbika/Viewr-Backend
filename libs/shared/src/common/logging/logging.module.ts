import { Global, Module } from '@nestjs/common';
import { FileLoggerService } from './file-logger.service';
import { LoggerConfig } from './logger.config';

@Global()
@Module({
  providers: [
    FileLoggerService,
    {
      provide: 'LOGGER_CONFIG',
      useValue: LoggerConfig,
    },
  ],
  exports: [FileLoggerService, 'LOGGER_CONFIG'],
})
export class LoggingModule {}
