import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ThoracicService {
  private readonly logger = new Logger(ThoracicService.name);

  constructor() {
    this.logger.log('Thoracic Service initialized');
  }

  getHello(): string {
    return 'Hello from Thoracic Service!';
  }
}
