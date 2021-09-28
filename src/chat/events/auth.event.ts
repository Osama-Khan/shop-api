import { forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { events } from '.';
import { ConnectionService } from '../repository/connection/connection.service';

/** Event triggered when server receives login request
 * @param socket The socket of the connection
 * @param userId ID of the user trying to login
 */
export async function onLoginEvent(socket: Socket, userId: number) {
  const svc: ConnectionService = forwardRef(() => ConnectionService).forwardRef;
  await svc.insert({ socket: socket.id, user: userId } as any);
}

/** Event triggered when client disconnects
 * @param socket The socket of the connection
 */
export async function onLogoutEvent(socket: Socket) {
  const svc: ConnectionService = forwardRef(() => ConnectionService).forwardRef;
  const conn = await svc.findBySocket(socket.id);
  svc.remove(conn.id);
}

/** Emits the login success event
 * @param socket The socket that the event should be emitted on
 * @param user The user object to be sent with the event
 */
export function emitLoginSuccessEvent(socket: Socket, userId: number) {
  socket.emit(events.onLoginSuccess, userId);
}

/** Emits the login failed event
 * @param socket The socket that the event should be emitted on
 * @param message The message to be sent to the client
 */
export function emitLoginFailedEvent(socket: Socket, message: string) {
  socket.emit(events.onLoginFailed, message);
}
