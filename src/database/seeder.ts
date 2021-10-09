import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import seedLocations from './location/location-seeder';

async function seed() {
  const app = await NestFactory.create(AppModule);
  await seedLocations(app);
  app.close();
}

seed();
