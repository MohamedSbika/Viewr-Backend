import { Controller, Get } from '@nestjs/common';
import { DentalService } from './dental.service';

@Controller()
export class DentalController {
  constructor(private readonly dentalService: DentalService) {}

  @Get()
  getHello(): string {
    return this.dentalService.getHello();
  }
}
