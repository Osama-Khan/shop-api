import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { Address } from './address.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';
import { State } from 'src/location/state/state.entity';
import { City } from 'src/location/city/city.entity';

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
}
