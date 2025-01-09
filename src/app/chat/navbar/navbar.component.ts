import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService, IsTyping } from '../chat.service';
import { SearchedUsersComponent } from './searched-users/searched-users.component';
import { AuthService } from '../../auth/auth.service';
import { SelectedUser } from '../../selected-user.model';
import { SignalRService } from '../../signal-r.service';

@Component({
  standalone: true,
    selector: 'app-navbar',
    styleUrls: ['navbar.component.css'],
    templateUrl: 'navbar.component.html',
    imports: [CommonModule, FormsModule, SearchedUsersComponent],
})
export class NavbarComponent {
  searchString: string = ''
  isSearching: boolean = false
  isSearchFound: boolean = false
  timer: any
  displayTyping: IsTyping
  username: string = this.signalRService.username
  usersFound: SelectedUser[] = []
  usersChatted: SelectedUser[] = this.chatService.allUsers

  constructor(private chatService: ChatService, private authService: AuthService, private signalRService: SignalRService) {}

  ngOnInit() {
    this.chatService.searchProduced().subscribe(users => {
      this.usersFound = users
      if(this.usersFound.length > 0) {
        this.isSearchFound = true
      } else {
        this.isSearchFound = false
      }
      this.isSearching = false
    })
    this.chatService.getNewMessage().subscribe()
    this.chatService.getAllUsersChattedWith().subscribe(users => {
      this.usersChatted = users
    })
    this.chatService.getStatus().subscribe(istyping => {
      this.displayTyping = istyping
    })
  }

  clearSearch() {
    this.isSearchFound = false
    this.isSearching = false
    this.usersFound = []
    this.searchString = ''
  }

  search(keyword: string) {
    clearTimeout(this.timer)
    this.isSearching = true
    this.timer = setTimeout(() => {
      if(keyword.trim().length > 0) {
        this.chatService.searchUser(keyword)
      } else {
        this.isSearching = false
      }
    },1000)
  }

  logOut() {
    this.authService.logOut()
  }
};
