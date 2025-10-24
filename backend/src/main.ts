import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const cfg = app.get(ConfigService);
  app.enableCors({ origin: cfg.get('CORS_ORIGIN') || true, credentials: true });
  await app.listen(3000);
  console.log('Backend listening on http://localhost:3000');
}
bootstrap();
