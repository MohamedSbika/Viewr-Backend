import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BiologyService {
  private readonly logger = new Logger(BiologyService.name);

  constructor() {
    this.logger.log('Biology Service initialized');
  }

  getHello(): string {
    return 'Hello from Biology Service!';
  }
}
