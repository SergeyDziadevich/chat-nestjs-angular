import { Socket, SocketIoConfig} from "ngx-socket-io";
import { tokenGetter } from "../../app.module";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket {
  constructor() {
    const config: SocketIoConfig = { 
      url: 'http://localhost:3000',
      options: {
        extraHeaders: {
          Authorization: tokenGetter()
        }
      } 
    };
    super(config);
  }

  reconnect() {
    this.disconnect();
    const config: SocketIoConfig = { 
      url: 'http://localhost:3000',
      options: {
        extraHeaders: {
          Authorization: tokenGetter()
        }
      } 
    };
    this.connect();
  }
}
