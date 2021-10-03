import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { EventService } from './chat/event/event.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const nestServer = await app.listen(process.env.PORT);
  app.get(EventService).initServer(nestServer);
}
bootstrap();
