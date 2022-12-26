import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

import { CustomSocket } from "../../sockets/custom-socket";
import { IRoom, IRoomPaginate } from "../../../model/room.interface";
import { Observable } from "rxjs";
import { IMessage, IMessagePaginate } from "../../../model/message.interace";

@Injectable({
  providedIn: 'root'
})
export class  ChatService {

  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) { }

  sentMessage(message: IMessage) {
    this.socket.emit('addMessage', message)
  }

  getAddedMessage(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>('messageAdded')
  }

  getMessages(): Observable<IMessagePaginate> {
    return this.socket.fromEvent<IMessagePaginate>('messages')
  }

  joinRoom(room: IRoom) {
    this.socket.emit('joinRoom', room)
  }

  leaveRoom(room: IRoom) {
    this.socket.emit('leaveRoom', room )
  }

  getMyRooms(): Observable<IRoomPaginate> {
    return this.socket.fromEvent<IRoomPaginate>('rooms')
  }

  createRoom (room: IRoom) {
    this.socket.emit('createRoom', room);
    this.snackbar.open(`${room.name} created successfully`, 'Close',
      { duration: 2000, horizontalPosition: "right", verticalPosition: "top"});
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms',  {limit, page});  // to chat.gateway 'paginateRooms'
  }
}

