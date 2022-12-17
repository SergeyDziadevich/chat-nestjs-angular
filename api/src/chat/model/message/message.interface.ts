import { IUser } from '../../../user/model/user.interface';
import { IRoom } from '../room/room.interface';

export interface IMessage {
  id?: number;
  text: string;
  user: IUser;
  room: IRoom;
  created_at: Date;
  updated_at: Date;
}
