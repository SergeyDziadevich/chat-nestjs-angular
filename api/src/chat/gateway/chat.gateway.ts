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
import { RoomService } from '../services/room-service/room/room.service';
import { IRoom } from '../model/room.interface';
import { IPage } from '../model/page.interface';

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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log('handle connection');

    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      console.log('handle connection user: ', user);

      if (!user) {
        console.log('no user!!!');
        return this.disconnect(socket);
      } else {
        console.log('user: ', user);
        socket.data.user = user;

        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });

        // substract page -1 to match front mat pagination
        rooms.meta.currentPage = rooms.meta.currentPage - 1;

        // Only emit rooms for specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket): any {
    this.disconnect(socket);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error ', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom): Promise<IRoom> {
    console.log('from createRoom creator :  ', socket.data.user);

    // TODO: why  undefined ??
    if (!socket.data.user) {
      console.log('!!! socket.data.user: ', socket.data.user);
      socket.data.user = {
        id: 2,
        username: 'username',
        email: 'info-new@dweb.by',
      };
    }

    return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page to match material paginator
    page.page = page.page + 1;

    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      page,
    );
    // substract page -1 to match front mat pagination
    rooms.meta.currentPage = rooms.meta.currentPage - 1;

    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
