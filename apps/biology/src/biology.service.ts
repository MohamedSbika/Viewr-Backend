import { Injectable } from '@nestjs/common';

@Injectable()
export class BiologyService {
  getHello(): string {
    return 'Hello World!';
  }
}
