import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['encryption_key'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      //security concerns
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
