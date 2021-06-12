import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { Address } from './address.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';
import { State } from 'src/location/state/state.entity';
import { City } from 'src/location/city/city.entity';
import { Setting } from 'src/setting/setting.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class AddressService extends ApiService<Address> {
  constructor(
    @InjectRepository(Address)
    addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(State)
    private statesRepository: Repository<State>,
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {
    super(addressRepository, Address.relations);
  }

  async findAll(
    take?: number,
    relations?: any[],
    orderBy?: string,
    orderDir?: 'ASC' | 'DESC',
    where?: string | ObjectLiteral,
  ): Promise<any[]> {
    const addresses: any = await super.findAll(
      take,
      relations,
      orderBy,
      orderDir,
      where,
    );
    if (relations?.includes('city')) {
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
    return addresses;
  }

  async findOne(id) {
    const address: any = await super.findOne(id);

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
