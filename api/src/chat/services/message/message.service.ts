import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../../model/message/message.entity';
import { Repository } from 'typeorm';
import { IMessage } from '../../model/message/message.interface';
import { IRoom } from '../../model/room/room.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: IMessage): Promise<IMessage> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessageForRoom(
    room: IRoom,
    options: IPaginationOptions,
  ): Promise<Pagination<IMessage>> {
    const query = this.messageRepository
      .createQueryBuilder('messages')
      .leftJoin('messages.room', 'room')
      .where('room.id  = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user ')
      .orderBy('message.created_at', 'ASC');

    return paginate(query, options);
  }
}
