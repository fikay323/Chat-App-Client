import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService, IsTyping } from '../../chat.service';
import { SelectedUser } from '../../../selected-user.model';
import { TruncatePipe } from '../../../truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searched-users',
  standalone: true,
  imports: [TruncatePipe, CommonModule],
  templateUrl: './searched-users.component.html',
  styleUrl: './searched-users.component.css'
})
export class SearchedUsersComponent {
  @Input('user') user: SelectedUser
  @Input('isTyping') isTyping: IsTyping
  @Output() closeSearch: EventEmitter<void> = new EventEmitter

  constructor(private chatService: ChatService) {}

  selectUser(user) {
    this.chatService.selectUser(user)
    this.closeSearch.emit()
  }
}
