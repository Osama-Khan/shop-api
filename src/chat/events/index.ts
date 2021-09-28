import { onConnectEvent } from './Connection.event';
import {
  onLoginEvent,
  onLogoutEvent,
  emitLoginSuccessEvent,
  emitLoginFailedEvent,
} from './auth.event';
import { onSendMessageEvent, emitReceiveMessageEvent } from './message.event';

export {
  onConnectEvent,
  onLoginEvent,
  onLogoutEvent,
  emitLoginSuccessEvent,
  emitLoginFailedEvent,
  onSendMessageEvent,
  emitReceiveMessageEvent,
};

/** An object containing the possible events and their string names */
export const events = {
  /** Event triggered when connection is established */
  onConnect: 'connection',
  /** Event triggered when user disconnects */
  onDisconnect: 'disconnect',

  /** Event triggered when user tries to login to chat */
  onLogin: 'login',
  /** Event triggered when user is logged in to chat */
  onLoginSuccess: 'loginSuccess',
  /** Event triggered when user can not be logged in to the chat */
  onLoginFailed: 'loginFailed',

  /** Event triggered when a user sends a message */
  onSendMessage: 'sendMessage',
  /** Event triggered when a user receives a message */
  onReceiveMessage: 'receiveMessage',
};
