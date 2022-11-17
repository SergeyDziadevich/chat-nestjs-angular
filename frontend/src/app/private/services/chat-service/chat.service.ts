import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { CustomSocket } from "../../sockets/custom-socket";

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
}
