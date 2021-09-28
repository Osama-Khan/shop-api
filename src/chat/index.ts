import { Server } from 'socket.io';
import { events, onConnectEvent } from './events';

/** Creates the Chat server
 * @param nestServer The httpServer reference returned by listen method of the nest app
 */
export function createServer(nestServer: any): void {
  const io = new Server(nestServer);

  io.on(events.onConnect, onConnectEvent);
}
