import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Message } from '../../../core/models/message.model';
import { ChatService, IsTyping } from '../../../infrastructure/chat/chat.service';
import { SelectedUser } from '../../../core/models/selected-user.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { ChatStartComponent } from '../chat-start/chat-start.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, ChatStartComponent, FormsModule, TruncatePipe],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  messages: Message[] = [];
  @ViewChild('scrollMe') private readonly scrollContainer: ElementRef;
  typingMessage = 'User is typing';
  selectedUser: SelectedUser;
  currentUser: User;
  username = this.chatService.username;
  displayTyping: IsTyping;
  changed = false;
  isInputFocused = false;

  constructor(
    private readonly chatService: ChatService, 
    private readonly authService: AuthService
  ){}

  ngOnInit(){
    this.authService.userConnected$.subscribe(user => {
      this.currentUser = user;
    })
    this.chatService.unRecievedMessages();
    this.chatService.getStatus().subscribe(istyping => {
      this.displayTyping = istyping;
    })

    this.chatService.selectedUser.subscribe(user => {
      if(this.selectedUser !== user || this.messages.length === 0){
        this.selectedUser = user;
        const filtered = this.chatService.allMessages.find(userMessages => {
          return Object.keys(userMessages)[0] === user.userID;
        })
        if(filtered) {
          this.messages = filtered[user.userID]
          this.scrollToBottom();
        } else {
          this.messages = [];
        }
      } else {
        console.log('idiot')
      }
    })
  }

  ngAfterViewChecked() {
    if(!this.isInputFocused) {
      this.scrollToBottom();
    }
  }

  onInputFocus(event: any) {
    this.isInputFocused = true;
    this.checkTyping(event.target.value);
  }

  onInputBlur() {
    this.isInputFocused = false;
    this.changed = false;
    this.chatService.emitStatus(false, this.selectedUser.userID);
  }

  scrollToBottom() {
    try {
      const container = this.scrollContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (error) {
      console.error('Failed to scroll to bottom:', error);
    }
  }

  submitForm(messageForm: NgForm) {
    if(messageForm.value['message'].trim() == '') return 
    let message = new Message(messageForm.value['message'], this.selectedUser.userID, this.currentUser.userID)
    this.scrollToBottom()
    this.chatService.sendMessage(message)
    this.chatService.updateAllMessages(message, this.selectedUser)
    messageForm.setValue({
      "message": ''
    })
  }

  checkTyping(event: any) {
    const message = event.trim();
    if(message != '' && !this.changed) {
      this.changed = true;
      this.chatService.emitStatus(true, this.selectedUser.userID);
    } else if(message == '' && this.changed) {
      this.changed = false;
      this.chatService.emitStatus(false, this.selectedUser.userID);
    }
  }
}