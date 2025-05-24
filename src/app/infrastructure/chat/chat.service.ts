import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '../../core/models/message.model';
import { SelectedUser } from '../../core/models/selected-user.model';

import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { SignalRService } from '../signalr/signal-r.service';
import { User } from '../../core/models/user.model';
import { AuthService } from '../auth/auth.service';
import { IChatService } from '../../core/interfaces/chat.service.interface';

export interface IsTyping {
  isTyping: boolean,
  senderID?: string
}

@Injectable({
  providedIn: 'root',
})

export class ChatService implements IChatService {
  message: Subject<Message> = new Subject<Message>();
  usersFound: Subject<any[]> = new Subject<any[]>(); 
  isTyping: BehaviorSubject<IsTyping> = new BehaviorSubject<IsTyping>({isTyping: false});
  selectedUser: Subject<SelectedUser> = new Subject<SelectedUser>();
  allMessages: { [key: string]: Message[] }[] = [];
  currentUser: User
  private readonly allUsersSubject: BehaviorSubject<SelectedUser[]> = new BehaviorSubject([]);
  allUsers: SelectedUser[] = []
  private readonly hubConnection: HubConnection;
  readonly username = this.signalRService.username;
  
  constructor(
    private readonly signalRService: SignalRService, 
    private readonly authservice: AuthService
  ) {
    this.hubConnection = signalRService.getHubConnection()
    authservice.userConnected$.subscribe(user => {
      this.currentUser = user
    })
    this.allUsersSubject.subscribe(users => {
      this.allUsers = users
    })
  }

  sendMessage(message: Message) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', message)
        .catch(error => console.warn('Error sending message:', error));
    } else {
      console.warn('Not connected, message not sent:', message);
      this.signalRService.startConnection(); 
    }
  }
  
  unRecievedMessages = () => {
    this.hubConnection.on('unread_messages', (unreadMessages: Message[]) => {
      unreadMessages.forEach(messageRecieved => {
        const eachUserThatMessagedWhileOffline: SelectedUser = new SelectedUser(messageRecieved.senderName, messageRecieved.sentBy) 
        const userPresentInArray = this.allUsers.find(user => user.userID === messageRecieved.sentBy)
        if(userPresentInArray) {
          const index = this.allUsers.findIndex(user => user.userID === userPresentInArray.userID)
          this.allUsers.splice(index, 1)
          this.allUsers.unshift(eachUserThatMessagedWhileOffline)
        } else {
          this.allUsers.unshift(eachUserThatMessagedWhileOffline)
        }
        this.allUsersSubject.next(this.allUsers)
      })
      unreadMessages.forEach(messagesRecieved => { // Use forEach for clarity
        const isPresent = this.allMessages.find(userChats => messagesRecieved.sentBy in userChats);
        if (isPresent) {
          Object.values(isPresent)[0].push(messagesRecieved); // Use Object.values
        } else {
          this.allMessages.push({ [messagesRecieved.sentBy]: [messagesRecieved] });
        }
        const chatPresent = this.allUsers.find(user => messagesRecieved.sentBy === user.userID);
        if (chatPresent) {
          this.allUsers = this.allUsers.filter(u => u.userID !== chatPresent.userID);
          this.allUsers.unshift(chatPresent);
        } else {
          this.allUsers.unshift(new SelectedUser(messagesRecieved.sentBy, messagesRecieved.sentBy));
        }
      });
    });
  };

  getAllUsersChattedWith() {
    return this.allUsersSubject.asObservable()
  }

  // saveToLocalStorage() {
  //   const allData  = [{allMessages: this.allMessages}, {usersChatted: this.allUsers}]
  //   localStorage.setItem(`${socket.id}`, JSON.stringify(allData))
  // }

  updateAllMessages(message: Message, user: SelectedUser) {
    const selectedUserChats = this.allMessages.find(userMessaged => user.userID in userMessaged);
    if (selectedUserChats) {
      Object.values(selectedUserChats)[0].push(message);
    } else {
      this.allMessages.push({ [user.userID]: [message] });
      this.selectedUser.next(user);
    }
    this.updateAllUsers(user);
  }

  updateAllUsers(user: SelectedUser) {
    if(this.allUsers.find(u => u.userID ===user.userID )){
      this.allUsers = this.allUsers.filter(u => u.userID !== user.userID);
      this.allUsers.unshift(user);
    } else {
      this.allUsers.unshift(user)
    }
    this.allUsersSubject.next(this.allUsers)
  }

  getNewMessage = () => {
    this.hubConnection.on('receive-message', (message: Message) => {
      this.message.next(message);
      const isPresent = this.allMessages.find(userMessaged => message.sentBy in userMessaged);
      if (isPresent) {
        Object.values(isPresent)[0].push(message);
      } else {
        this.allMessages.push({ [message.sentBy]: [message] });
      }
      const user: SelectedUser = new SelectedUser(message.senderName, message.sentBy);
      this.updateAllUsers(user);
    });
    return this.message.asObservable();
  };

  emitStatus(isTyping: boolean, recipientID: string) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('IsTyping', isTyping, recipientID, this.currentUser.userID)
        .catch(error => console.log('Error sending typing notification:', error));
    } else {
      console.warn('Not connected, typing status not sent');
      this.signalRService.startConnection();
    }
  }

  getStatus = () => {
    this.hubConnection.on('typing', (isTyping: boolean, senderID: string) => {
      this.isTyping.next({isTyping: isTyping, senderID: senderID});
    });
    return this.isTyping.asObservable();
  };

  searchUser(keyword: string) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('SearchUsers', keyword, this.currentUser.userID)
        .catch(error => console.error('Error searching users:', error));
    } else {
      console.warn('Not connected, search not performed');
      this.signalRService.startConnection();
    }
  }

  searchProduced(): Observable<SelectedUser[]> {
    this.hubConnection.on('search_produced', users => {
      this.usersFound.next(users)
    })
    return this.usersFound.asObservable()
  }

  selectUser(user: SelectedUser) {
    this.selectedUser.next(user)
  }  
}