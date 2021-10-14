import { INestApplication } from '@nestjs/common';
import { RolesService } from 'src/api/roles/roles.service';
import LogHelper from 'src/shared/helpers/log.helper';
import * as roles from './roles.json';

export default async function seedRoles(app: INestApplication) {
  const svc = app.get(RolesService);
  if ((await svc.count()) > 0) {
    LogHelper.warn("Skipping role seed since the table is not empty!");
    return;
  }
  LogHelper.info('Seeding roles...');
  for (const r of roles) {
    try {
      await svc.insert(r as any);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded roles!');
}
