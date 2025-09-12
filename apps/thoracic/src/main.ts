import { NestFactory } from '@nestjs/core';
import { ThoracicModule } from './thoracic.module';

async function bootstrap() {
  const app = await NestFactory.create(ThoracicModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
