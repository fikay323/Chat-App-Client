import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

import { User } from '../user.model';
import { SignalRService } from '../signal-r.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly LOCALSTORAGE_KEY = "user-details"
  private hubConnection: HubConnection
  isFetching = new BehaviorSubject<boolean>(false);
  errorMessage = new BehaviorSubject<string | null>(null);
  userConnected = new BehaviorSubject<User | null>(null);


  constructor(private router: Router, private signalRService: SignalRService) {
    this.hubConnection = signalRService.getHubConnection()
    this.authSignalRHandlers()
  }

  async signUp(user: User) {
    this.isFetching.next(true)
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        return await this.hubConnection.invoke('Register', user.username, user.password);
      } catch (error) {
        console.log(error.message)
        throw error;
      }
    } else {
      console.warn("Not connected, registration failed");
      throw new Error("Not connected to the server.");
    }
  }
  
  async login(user: User, autologin?: { autologin: boolean }) {
    this.isFetching.next(true);  
    let interval
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.handleLogin(user)
    } else {
      let count = 0
      interval = setInterval(() => {
        count++
        if (count <= 1) {
          this.handleLogin(user)
        } else {
          clearInterval(interval)
          if (autologin.autologin && this.hubConnection?.state !== HubConnectionState.Connected) {
            console.warn("An error occurred, Pls login again");
            throw new Error("Not connected to the server.");
          } else if(!autologin.autologin ) {
            console.warn("Not connected, login failed");
            throw new Error("Not connected to the server.");
          }
        }
      }, 2000);
    }
  }

  private async handleLogin(user: User) {
    try {
      return await this.hubConnection.invoke('Login', user.username, user.password);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  
  private authSignalRHandlers() {
    this.hubConnection.on('RegistrationSuccessful', (user: User) => {
      this.handleAuth(user)
    });
    
    this.hubConnection.on('RegistrationFailed', (error: string) => {
      console.log(error)
      this.errorMessage.next(error);
      this.isFetching.next(false);
    });
    
    this.hubConnection.on('LoginSuccessful', (user: User) => {
      this.handleAuth(user)
      this.getUnreadMessages()
    });
    
    this.hubConnection.on('LoginFailed', (error: string) => {
      console.log(error)
      this.errorMessage.next(error);
      this.isFetching.next(false);
    });
  }

  getUnreadMessages = () => {
    let currentUser: User
    this.userConnected.subscribe(user => {
      currentUser = user
    })
    this.hubConnection.invoke('GetUnreadMessages', currentUser.userID)
  }

  private handleAuth = (user: User) => {
    this.isFetching.next(false);
      this.userConnected.next(user);
      localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(user));
      this.signalRService.initialize(user.username);
      this.router.navigate(['chat']);
  }

  logOut() {
    this.signalRService.destroy(); 
    localStorage.removeItem('userID');
    this.userConnected.next(null);
    this.router.navigate(['auth/login']);
  }

  autoLogin() {
    const unparsedUser = localStorage.getItem(this.LOCALSTORAGE_KEY);
    if (unparsedUser) {
      const user: User = JSON.parse(unparsedUser)
      this.login(user, {autologin: true})
    }
  }
}