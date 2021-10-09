import { CountryService } from 'src/api/location/country/country.service';
import { INestApplication } from '@nestjs/common';
import * as countries from './country/countries.json';
import * as states from './state/states.json';
import * as cities from './city/cities.json';
import LogHelper from 'src/shared/helpers/log.helper';
import { StateService } from 'src/api/location/state/state.service';
import { CityService } from 'src/api/location/city/city.service';

async function seedCountries(app: INestApplication) {
  const svc = app.get(CountryService);
  if ((await svc.count()) === countries.length) return;
  LogHelper.info('Seeding countries...');
  for (const d of countries) {
    const c: any = { ...d, phoneCode: d.phone_code, subRegion: d.subregion };
    try {
      await svc.insert(c);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded countries!');
}

async function seedStates(app: INestApplication) {
  const svc = app.get(StateService);
  if ((await svc.count()) === states.length) return;
  LogHelper.info('Seeding states...');
  for (const d of states) {
    const s: any = { ...d, stateCode: d.state_code, country: d.country_id };
    try {
      await svc.insert(s);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded states!');
}

async function seedCities(app: INestApplication) {
  const svc = app.get(CityService);
  if ((await svc.count()) === cities.length) return;
  LogHelper.info('Seeding cities...');
  for (const d of cities as any) {
    const c: any = { ...d, state: d.state_id };
    try {
      await svc.insert(c as any);
    } catch (ex) {
      throw ex;
    }
  }
  LogHelper.success('Seeded cities!');
}

export default async function seedLocations(app: INestApplication) {
  await seedCountries(app);
  await seedStates(app);
  await seedCities(app);
}
