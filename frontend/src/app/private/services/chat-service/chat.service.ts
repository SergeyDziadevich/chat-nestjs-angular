import { Injectable } from '@angular/core';

import { CustomSocket } from "../../sockets/custom-socket";
import { IRoom, IRoomPaginate } from "../../../model/room.interface";
import { IUser } from "../../../model/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) { }

  sentMessage() {

  }

  getMessage() {
    return this.socket.fromEvent('message')
  }

  getMyRooms() {
    return this.socket.fromEvent<IRoomPaginate>('rooms')
  }

  createRoom () {
    const user2: IUser = {
      id: 3
    }

    const room: IRoom = {
      name: 'test room',
      users: [user2]
    }

    this.socket.emit('createRoom', room)
  }
}
