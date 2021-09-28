import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { Connection } from './connection.entity';

@Injectable()
export class ConnectionService extends ApiService<Connection> {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
  ) {
    super(connectionRepository, Connection.relations);
  }

  findBySocket(socketId: string) {
    return this.connectionRepository.findOne({ socket: socketId });
  }
}
