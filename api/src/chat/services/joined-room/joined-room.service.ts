import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JoinedRoomEntity } from '../../model/joined-room/joined-room.entity';
import { IRoom } from '../../model/room/room.interface';
import { IJoinedRoom } from '../../model/joined-room/joined-room.interface';
import { IUser } from '../../../user/model/user.interface';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoomUser: IJoinedRoom): Promise<IJoinedRoom> {
    return this.joinedRoomRepository.save(joinedRoomUser);
  }

  async findByUser(user: IUser): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { user } });
  }

  async findByRoom(room: IRoom): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { room } });
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
