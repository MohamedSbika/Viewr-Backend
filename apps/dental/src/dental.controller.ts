import { DentalService } from './dental.service';
import { MessagePattern } from '@nestjs/microservices';
import { FileLoggerService } from '@app/shared/common/logger/file-logger.service';

export class DentalController {
  private readonly logFileName = 'app';

  constructor(
    // private readonly appService: DentalService,
    // private readonly logger: FileLoggerService,
  ) {}

  @MessagePattern('dental.healthCheck')
  healthCheck() {
    console.log('Received health check request');
    return { status: 'ok', message: 'Dental service is healthy' };
  }
}
