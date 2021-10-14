import { NestFactory } from '@nestjs/core';
import LogHelper from 'src/shared/helpers/log.helper';
import seedLocations from './location/location-seeder';
import seedOrders from './order/order-seeder';
import seedRoles from './role/role-seeder';
import { SeederModule } from './seeder.module';
import seedUsers from './user/user-seeder';
import * as dotenv from 'dotenv';

async function seed() {
  const app = await NestFactory.create(SeederModule);
  LogHelper.info('<--- Location Seeding --->');
  await seedLocations(app);
  LogHelper.info('<--- Order Seeding --->');
  await seedOrders(app);
  LogHelper.info('<--- Role Seeding --->');
  await seedRoles(app);
  LogHelper.info('<--- User Seeding --->');
  await seedUsers(app);
  app.close();
}

seed();
