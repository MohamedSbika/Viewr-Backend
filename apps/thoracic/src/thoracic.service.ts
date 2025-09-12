import { Injectable } from '@nestjs/common';

@Injectable()
export class ThoracicService {
  getHello(): string {
    return 'Hello World!';
  }
}
