import { DataSource } from 'typeorm';
import { UserEntity } from '../user/model/user.entity';
import { MessageEntity } from '../chat/model/message/message.entity';
import { JoinedRoomEntity } from '../chat/model/joined-room/joined-room.entity';
import { RoomEntity } from '../chat/model/room/room.entity';
import { ConnectedUserEntity } from '../chat/model/connected-user/connected-user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgres://user:password@localhost:35000/db',
  entities: [
    UserEntity,
    ConnectedUserEntity,
    RoomEntity,
    JoinedRoomEntity,
    MessageEntity,
  ],
  synchronize: true,
});
