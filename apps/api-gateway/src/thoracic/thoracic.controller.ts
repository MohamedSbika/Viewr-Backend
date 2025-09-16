import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ThoracicService } from './thoracic.service';

@Controller('thoracic')
export class ThoracicController {
  private readonly logger = new Logger(ThoracicController.name);

  constructor(
    private readonly thoracicService: ThoracicService,
    @Inject('THORACIC_SERVICE') private readonly thoracicClient: ClientProxy,
  ) {
    this.logger.log('Thoracic controller initialized');
  }

  @Get()
  getHello(): string {
    this.logger.log('Thoracic Hello World endpoint called');
    return 'Hello World from Thoracic Controller!';
  }
}
