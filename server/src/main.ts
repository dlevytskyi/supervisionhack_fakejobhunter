import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  if (process.env.ENVIRONMENT === 'DEV') {
    app.enableCors();
  }
  await app.listen(3000, '0.0.0.0', () =>
    console.log(`Listening on port: 3000`),
  );
}
bootstrap();
