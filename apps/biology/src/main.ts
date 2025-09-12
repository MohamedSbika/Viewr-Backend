import { NestFactory } from '@nestjs/core';
import { BiologyModule } from './biology.module';

async function bootstrap() {
  const app = await NestFactory.create(BiologyModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
