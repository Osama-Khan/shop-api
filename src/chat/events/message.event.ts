import { forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { events } from '.';
import MessageDTO from '../models/message.dto';
import { ConnectionService } from '../repository/connection/connection.service';
import { MessageService } from '../repository/message/message.service';

/** Event triggered when client sends a message
 * @param socket The socket of the connection
 * @param message The message sent by the client
 * @param to ID of the user that the message was sent to
 */
export async function onSendMessageEvent(
  socket: Socket,
  message: string,
  to: number,
) {
  const conSvc: ConnectionService = forwardRef(() => ConnectionService)
    .forwardRef;
  const from = (await conSvc.findBySocket(socket.id)).id;
  const msgSvc: MessageService = forwardRef(() => MessageService).forwardRef;
  msgSvc.insert({ message, from, to, time: new Date() } as any);
  const dto = new MessageDTO({ message, sender: from, time: new Date() });

  const toSocket = (await conSvc.findOne(to)).socket;
  if (toSocket) {
    emitReceiveMessageEvent(socket, dto, toSocket);
  }
}

/** Emits the receive message event
 * @param socket The socket that the event should be emitted on
 * @param message The message object to be sent with the event
 * @param socketId ID of the socket of the user who the message was sent to
 */
export function emitReceiveMessageEvent(
  socket: Socket,
  dto: MessageDTO,
  socketId: string,
) {
  socket.to(socketId).emit(events.onReceiveMessage, dto);
}
