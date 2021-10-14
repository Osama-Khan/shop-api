import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';
import LogHelper from 'src/shared/helpers/log.helper';
import * as users from './users.json';

export default async function seedUsers(app: INestApplication) {
  const svc = app.get(UsersService);
  if ((await svc.count()) > 0) {
    LogHelper.warn('Skipping user seed since the table is not empty!');
    return;
  }
  LogHelper.info('Seeding users...');
  for (const user of users) {
    const u: any = {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
    };
    try {
      await svc.insert(u as any);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded users!');
}
