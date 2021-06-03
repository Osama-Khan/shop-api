import { CountryService } from 'src/location/country/country.service';
import { INestApplication } from '@nestjs/common';
import * as countries from './country/countries.json';
import * as states from './state/states.json';
import * as cities from './city/cities.json';
import LogHelper from 'src/shared/helpers/log.helper';
import { StateService } from 'src/location/state/state.service';
import { CityService } from 'src/location/city/city.service';

async function seedCountries(app: INestApplication) {
  const svc = app.get(CountryService);
  for (const d of countries) {
    const c: any = { ...d, phoneCode: d.phone_code, subRegion: d.subregion };
    LogHelper.info('[Country Seeder] - Inserting Country: ' + c.name);
    try {
      await svc.insert(c);
      LogHelper.success('[Country Seeder] - Inserted Country: ' + c.name);
    } catch (ex) {
      LogHelper.error('[Country Seeder] - Failed to insert Country: ' + c.name);
      throw ex;
    }
  }
}

async function seedStates(app: INestApplication) {
  const svc = app.get(StateService);
  for (const d of states) {
    const s: any = { ...d, stateCode: d.state_code, country: d.country_id };
    LogHelper.info('[State Seeder] - Inserting State: ' + s.name);
    try {
      await svc.insert(s);
      LogHelper.success('[State Seeder] - Inserted State: ' + s.name);
    } catch (ex) {
      LogHelper.error('[State Seeder] - Failed to insert State: ' + s.name);
      throw ex;
    }
  }
}

async function seedCities(app: INestApplication) {
  const svc = app.get(CityService);
  for (const d of cities as any) {
    const c: any = { ...d, state: d.state_id };
    LogHelper.info('[City Seeder] - Inserting City: ' + c.name);
    try {
      await svc.insert(c as any);
      LogHelper.success('[City Seeder] - Inserted City: ' + c.name);
    } catch (ex) {
      LogHelper.error('[City Seeder] - Failed to insert City: ' + c.name);
      throw ex;
    }
  }
}

export default async function seedLocations(app: INestApplication) {
  await seedCountries(app);
  await seedStates(app);
  await seedCities(app);
}
