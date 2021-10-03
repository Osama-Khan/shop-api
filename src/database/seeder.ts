import { NestFactory } from '@nestjs/core';
import { ApiModule } from 'src/api/api.module';
import seedLocations from './location/location-seeder';

async function seed() {
  const app = await NestFactory.create(ApiModule);
  await seedLocations(app);
  app.close();
}

seed();
