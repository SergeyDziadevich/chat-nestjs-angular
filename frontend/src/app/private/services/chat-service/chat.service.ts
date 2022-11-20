import { Injectable } from '@angular/core';

import { CustomSocket } from "../../sockets/custom-socket";
import { IRoomPaginate } from "../../../model/room.interface";

@Injectable({
  providedIn: 'root'
})
export class  ChatService {

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

  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms',  {limit, page});  // to chat.gateway 'paginateRooms'
  }
}
