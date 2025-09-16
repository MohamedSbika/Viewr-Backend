import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BiologyService } from './biology.service';

@Controller('biology')
export class BiologyController {
  private readonly logger = new Logger(BiologyController.name);

  constructor(
    private readonly biologyService: BiologyService,
    @Inject('BIOLOGY_SERVICE') private readonly biologyClient: ClientProxy,
  ) {
    this.logger.log('Biology controller initialized');
  }

  @Get()
  getHello(): string {
    this.logger.log('Biology Hello World endpoint called');
    return 'Hello World from Biology Controller!';
  }
}
