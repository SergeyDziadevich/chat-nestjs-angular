import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/service/auth.service';
import { IUser } from '../../user/model/user.interface';
import { UserService } from '../../user/service/user.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', 'test');
    return 'Hello world!';
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      if (!user) {
        return this.disconnect(socket);
      } else {
        this.title.push('Value ' + Math.random().toString());
        this.server.emit('message', this.title);
      }
    } catch {
      return this.disconnect(socket);
    }
    //
    // console.log('on Connect');
    // this.server.emit('message', 'test connect');
  }

  handleDisconnect(socket: Socket): any {
    this.disconnect(socket);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error ', new UnauthorizedException());
    socket.disconnect();
  }
}
