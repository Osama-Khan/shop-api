import { Socket } from 'socket.io';
import { events, onLoginEvent, onLogoutEvent, onSendMessageEvent } from '.';

/** Event triggered when server receives a connection
 * @param socket The socket of the connection
 */
export function onConnectEvent(socket: Socket) {
  socket.on(events.onLogin, (id) => {
    onLoginEvent(socket, id);
    socket.on(events.onSendMessage, (message, to) =>
      onSendMessageEvent(socket, message, to),
    );
    socket.on(events.onDisconnect, () => onLogoutEvent(socket));
  });
}
