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
    return paginate(this.messageRepository, options, {
      room,
      relations: ['user', 'room'],
    });
  }
}
