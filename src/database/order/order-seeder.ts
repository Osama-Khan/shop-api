import { INestApplication } from '@nestjs/common';
import * as states from './order-state/order-states.json';
import LogHelper from 'src/shared/helpers/log.helper';
import { OrderStateService } from 'src/database/order/order-state/order-state.service';

async function seedStates(app: INestApplication) {
  const svc = app.get(OrderStateService);
  if ((await svc.count()) > 0) {
    LogHelper.warn("Skipping state seed since the table is not empty!");
    return;
  }
  LogHelper.info('Seeding order states...');
  for (const s of states) {
    try {
      await svc.insert(s as any);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded order states!');
}

export default async function seedOrders(app: INestApplication) {
  await seedStates(app);
}
