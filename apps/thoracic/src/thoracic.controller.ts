import { Controller, Get } from '@nestjs/common';
import { ThoracicService } from './thoracic.service';

@Controller()
export class ThoracicController {
  constructor(private readonly thoracicService: ThoracicService) {}

  @Get()
  getHello(): string {
    return this.thoracicService.getHello();
  }
}
