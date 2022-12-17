import { IUser } from '../../../user/model/user.interface';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
