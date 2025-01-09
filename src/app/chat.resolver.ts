import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { ChatService } from './chat/chat.service';
import { Message } from './message.model';

export const ChatResolver: ResolveFn<{[key: string]: Message[]}[]> = (route, state) => {
  const chatService = inject(ChatService)
  // if(localStorage[`${socket.id}`]) {
  //   const savedData = JSON.parse(localStorage.getItem(`${socket.id}`))
  //   // console.log(savedData)
  //   chatService.allMessages = savedData[0].allMessages
  //   chatService.allUsers = savedData[1].usersChatted
  //   return savedData
  // }
  return []
};
