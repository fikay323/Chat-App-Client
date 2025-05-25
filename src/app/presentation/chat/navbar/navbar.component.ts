import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchedUsersComponent } from './searched-users/searched-users.component';
import { ChatService, IsTyping } from '../../../infrastructure/chat/chat.service';
import { SelectedUser } from '../../../core/models/selected-user.model';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  styleUrls: ['navbar.component.css'],
  templateUrl: 'navbar.component.html',
  imports: [CommonModule, FormsModule, SearchedUsersComponent],
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchString: string = '';
  isSearching: boolean = false;
  isSearchFound: boolean = false;
  timer: any;
  displayTyping: IsTyping;
  username: string = "";
  usersFound: SelectedUser[] = [];
  usersChatted: SelectedUser[] = this.chatService.allUsers;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.chatService.searchProduced()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.usersFound = users
        if (this.usersFound.length > 0) {
          this.isSearchFound = true;
        } else {
          this.isSearchFound = false;
        }
        this.isSearching = false;
      })
    this.chatService.getNewMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.chatService.getAllUsersChattedWith()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.usersChatted = users;
      });
    this.chatService.getStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(istyping => {
        this.displayTyping = istyping;
      });
    this.authService.userConnected$
      .pipe(takeUntil(this.destroy$), filter(user => !!user))
      .subscribe({
        next: user => this.username = user.username
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch() {
    this.isSearchFound = false;
    this.isSearching = false;
    this.usersFound = [];
    this.searchString = '';
  }

  search(keyword: string) {
    clearTimeout(this.timer)
    this.isSearching = true;
    this.timer = setTimeout(() => {
      if (keyword.trim().length > 0) {
        this.chatService.searchUser(keyword);
      } else {
        this.isSearching = false;
      }
    }, 1000)
  }

  logOut() {
    this.authService.logOut();
  }
};
