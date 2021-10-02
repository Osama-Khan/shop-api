interface IMessageDTO {
  /** The content of the message */
  message: string;
  /** ID of the sender */
  sender: number;
  /** Time the message was received at the server on */
  time: Date;
  /** ID of the thread the message belongs to */
  threadId: number;
}

/** DTO for the message object sent to the client */
export default class MessageDTO implements IMessageDTO {
  message: string;
  sender: number;
  time: Date;
  threadId: number;

  constructor(message: IMessageDTO) {
    this.message = message.message;
    this.sender = message.sender;
    this.time = message.time;
    this.threadId = message.threadId;
  }
}
