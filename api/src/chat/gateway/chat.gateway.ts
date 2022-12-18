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
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RoomService } from '../services/room-service/room.service';
import { IRoom } from '../model/room/room.interface';
import { IPage } from '../model/page.interface';
import { ConnectedUserService } from '../services/connected-user/connected-user.service';
import { IConnectedUser } from '../model/connected-user/connected-user.interface';
import { JoinedRoomService } from '../services/joined-room/joined-room.service';
import { MessageService } from '../services/message/message.service';
import { IMessage } from '../model/message/message.interface';
import { IJoinedRoom } from '../model/joined-room/joined-room.interface';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private messageService: MessageService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

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

        // Save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });

        // Only emit rooms for specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);

    this.disconnect(socket);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error ', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom): Promise<IRoom> {
    const createdRoom: IRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: IConnectedUser[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });

      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      for (const connection of connections) {
        this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }

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
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      this.handleIncomingPageRequest(page),
    );
    // substract page -1 to match front mat pagination
    rooms.meta.currentPage = rooms.meta.currentPage - 1;

    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: IRoom) {
    const messages = await this.messageService.findMessageForRoom(room, {
      limit: 10,
      page: 1,
    });
    messages.meta.currentPage = messages.meta.currentPage - 1;

    // Save Connection to Room
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // Send last messages from Room to User
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    const createMessage: IMessage = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const room: IRoom = await this.roomService.getRoom(createMessage.room.id);
    const joinedUsers: IJoinedRoom[] = await this.joinedRoomService.findByRoom(
      room,
    );

    // TODO: Send new Message to all joined Users of the room (currently online)
  }

  private handleIncomingPageRequest(page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
