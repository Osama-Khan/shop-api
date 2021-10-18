import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import { EventService } from './chat/event/event.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: process.env.REQUEST_LIMIT }));
  app.use(urlencoded({ limit: process.env.REQUEST_LIMIT, extended: true }));
  app.enableCors();
  const nestServer = await app.listen(process.env.PORT);
  app.get(EventService).initServer(nestServer);
}
bootstrap();
