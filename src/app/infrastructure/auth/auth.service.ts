import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, firstValueFrom, from, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HubConnection, HubConnectionState } from '@microsoft/signalr';

import { User } from '../../core/models/user.model';
import { SignalRService } from '../signalr/signal-r.service';
import { IAuthService } from '../../core/interfaces/auth.service.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements IAuthService {
  private readonly LOCALSTORAGE_KEY = "user-details";
  private hubConnection: HubConnection = this.signalRService.getHubConnection();
  private readonly hubConnectionStatus$: Observable<boolean> = this.signalRService.getConnectionStatus();;
  isFetching$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);
  userConnected$ = new BehaviorSubject<User | null>(null);
  private currentUserId: string = null;


  constructor(
    private readonly router: Router,
    private readonly signalRService: SignalRService
  ) {}

  async signUp(user: User) {
    this.isFetching$.next(true);
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        return await this.hubConnection.invoke('Register', user.username, user.password);
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    } else {
      console.warn("Not connected, registration failed");
      throw new Error("Not connected to the server.");
    }
  }
  
  async login(user: User) {
    this.isFetching$.next(true);
  
    return firstValueFrom(
      this.hubConnectionStatus$.pipe(
        filter(status => status === true),
        take(1),
        switchMap(() => {
          this.hubConnection = this.signalRService.getHubConnection();
          return from(this.hubConnection.invoke('Login', user.username, user.password)
        )}),
        tap(() => this.isFetching$.next(false)),
        catchError(err => {
          this.isFetching$.next(false);
          return throwError(() => err);
        })
      )
    );
  }
  
  authSignalRHandlers() {
    return this.hubConnectionStatus$.pipe(
      filter(status => status),
      tap(() => {
        this.hubConnection = this.signalRService.getHubConnection();
        this.hubConnection.on('RegistrationSuccessful', (user: User) => {
          this.handleAuth(user);
        });
        
        this.hubConnection.on('RegistrationFailed', (error: string) => {
          console.log(error);
          this.errorMessage$.next(error);
          this.isFetching$.next(false);
        });
        
        this.hubConnection.on('LoginSuccessful', (user: User) => {
          this.handleAuth(user);
          this.getUnreadMessages();
        });
        
        this.hubConnection.on('LoginFailed', (error: string) => {
          console.log(error)
          this.errorMessage$.next(error);
          this.isFetching$.next(false);
        });
      })
    )
  }

  getUnreadMessages = () => {
    let currentUser: User
    this.userConnected$.pipe(filter(user => !!user)).subscribe(user => {
      currentUser = user;
    })
    this.hubConnection.invoke('GetUnreadMessages', currentUser.userID);
  }

  private handleAuth (user: User) {
    this.isFetching$.next(false);
    this.currentUserId = user.userID;
    this.userConnected$.next(user);
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(user));
    this.router.navigate(['chat']);
  }

  logOut() {
    localStorage.removeItem(this.LOCALSTORAGE_KEY);
    this.currentUserId = null;
    this.userConnected$.next(null);
    this.router.navigate(['auth/login']);
  }

  autoLogin() {
    const unparsedUser = localStorage.getItem(this.LOCALSTORAGE_KEY);
    if (unparsedUser) {
      const user: User = JSON.parse(unparsedUser);
      this.login(user);
    };
  }

  getUserId(): string {
    return this.currentUserId;
  }
}