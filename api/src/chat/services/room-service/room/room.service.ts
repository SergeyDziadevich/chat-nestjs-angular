import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../../model/room.entity';
import { Repository } from 'typeorm';
import { IRoom } from '../../../model/room.interface';
import { IUser } from '../../../../user/model/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async getRoomsForUser(
    userId: number,
    options?: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    console.error('userId: ', userId);

    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  async createRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    const newRoom = await this.addCreatorToRoom(room, creator);

    return this.roomRepository.save(newRoom);
  }

  async addCreatorToRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    room.users.push(creator);

    return room;
  }
}
