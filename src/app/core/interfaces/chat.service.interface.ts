import { Message } from '../models/message.model';
import { SelectedUser } from '../models/selected-user.model';
import { Observable } from 'rxjs';

export interface IChatService {
  sendMessage(message: Message): void;

  getNewMessage(): Observable<Message>;

  emitStatus(isTyping: boolean, recipientID: string): void;

  getStatus(): Observable<{ isTyping: boolean, senderID?: string }>;

  searchUser(keyword: string): void;

  searchProduced(): Observable<SelectedUser[]>;

  updateAllMessages(message: Message, user: SelectedUser): void;

  getAllUsersChattedWith(): Observable<SelectedUser[]>;
  
  selectUser(user: SelectedUser): void;

  username: string;
}
