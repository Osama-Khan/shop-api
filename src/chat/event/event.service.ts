import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import events from './events';
import { Message } from '../repository/message/message.entity';
import MessageDTO from '../models/message.dto';

type ConnectionType = {
  /** ID of the connected user */
  id: number;
  /** Socket that the user is connected to */
  socket: string;
};

/** Service that handles event emission and listening for socket.io */
@Injectable()
export class EventService {
  connectedUsers: ConnectionType[] = [];
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  /** Initializes socket.io server and starts connection listener.
   * Should be called only once.
   * @param server HttpServer reference returned by `nest.listen`.
   */
  initServer = (server: any) => {
    const io = new Server(server);
    io.on(events.onConnect, this.onConnectEvent);
  };

  /** Event triggered when server receives a connection
   * @param socket The socket of the connection
   */
  onConnectEvent = (socket: Socket) => {
    socket.on(events.onLogin, (id) => {
      this.onLoginEvent(socket, id);
      socket.on(events.onSendMessage, (message, to) =>
        this.onSendMessageEvent(socket, message, to),
      );
      socket.on(events.onDisconnect, () => this.onLogoutEvent(socket));
    });
  };

  /** Event triggered when server receives login request
   * @param socket The socket of the connection
   * @param userId ID of the user trying to login
   */
  onLoginEvent = async (socket: Socket, userId: number) => {
    const user = { socket: socket.id, id: userId };
    this.connectedUsers.push(user);
  };

  /** Event triggered when client disconnects
   * @param socket The socket of the connection
   */
  onLogoutEvent = async (socket: Socket) => {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u.socket !== socket.id,
    );
  };

  /** Emits the login success event
   * @param socket The socket that the event should be emitted on
   * @param user The user object to be sent with the event
   */
  emitLoginSuccessEvent = (socket: Socket, userId: number) => {
    socket.emit(events.onLoginSuccess, userId);
  };

  /** Emits the login failed event
   * @param socket The socket that the event should be emitted on
   * @param message The message to be sent to the client
   */
  emitLoginFailedEvent = (socket: Socket, message: string) => {
    socket.emit(events.onLoginFailed, message);
  };

  /** Event triggered when client sends a message
   * @param socket The socket of the connection
   * @param message The message sent by the client
   * @param to ID of the user that the message was sent to
   */
  onSendMessageEvent = async (socket: Socket, message: string, to: number) => {
    const from = this.connectedUsers.find((u) => u.socket === socket.id)?.id;
    if (!from) {
      return;
    }
    this.messageRepo.insert({ message, from, to, time: new Date() } as any);
    const dto = new MessageDTO({ message, sender: from, time: new Date() });

    this.connectedUsers
      .filter((u) => u.id === to)
      .forEach(({ socket: toSocket }) =>
        this.emitReceiveMessageEvent(socket, dto, toSocket),
      );
  };

  /** Emits the receive message event
   * @param socket The socket that the event should be emitted on
   * @param message The message object to be sent with the event
   * @param socketId ID of the socket of the user who the message was sent to
   */
  emitReceiveMessageEvent = (
    socket: Socket,
    dto: MessageDTO,
    socketId: string,
  ) => {
    socket.to(socketId).emit(events.onReceiveMessage, dto);
  };
}
