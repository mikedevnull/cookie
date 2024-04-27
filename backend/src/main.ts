import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug'],
  });
  const logger = new Logger();
  await app.listen(process.env.COOKIE_PORT || 3000);
  const appUrl = await app.getUrl();
  logger.log(`Server is listening on ${appUrl}`);
}
bootstrap();
