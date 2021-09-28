import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';
import { State } from 'src/api/location/state/state.entity';
import { City } from 'src/api/location/city/city.entity';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

@Injectable()
export class AddressService extends ApiService<Address> {
  constructor(
    @InjectRepository(Address)
    addressRepository: Repository<Address>,
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(State)
    private statesRepository: Repository<State>,
  ) {
    super(addressRepository, Address.relations);
  }

  async findAll(options: FindManyOptionsDTO<Address>) {
    const { data: addresses, meta } = await super.findAll(options);
    if (options.relations?.includes('city')) {
      for (let i = 0; i < addresses.length; i++) {
        let id = addresses[i].city.id;
        const city = await this.citiesRepository.findOne(id, {
          relations: ['state'],
        });
        id = city.state.id;
        const state = await this.statesRepository.findOne(id, {
          relations: ['country'],
        });
        addresses[i].city = city.name;
        addresses[i].state = state.name;
        addresses[i].country = state.country.name;
      }
    }
    return { data: addresses, meta };
  }

  async findOne(id, options: FindOneOptionsDTO<Address>) {
    const address: any = await super.findOne(id, options);

    if (address.city) {
      let id = address.city.id;
      const city = await this.citiesRepository.findOne(id, {
        relations: ['state'],
      });
      id = city.state.id;
      const state = await this.statesRepository.findOne(id, {
        relations: ['country'],
      });
      address.city = city.name;
      address.state = state.name;
      address.country = state.country.name;
    }
    return address;
  }
}
