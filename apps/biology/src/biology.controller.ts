import { Controller, Get } from '@nestjs/common';
import { BiologyService } from './biology.service';

@Controller()
export class BiologyController {
  constructor(private readonly biologyService: BiologyService) {}

  @Get()
  getHello(): string {
    return this.biologyService.getHello();
  }
}
