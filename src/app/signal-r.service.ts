import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private isConnected = new BehaviorSubject<boolean>(false);
  username: string;

  constructor() { 
    this.createConnection()
  }

  initialize(username: string) {
    this.username = username;
    this.startConnection();
  }
  
  destroy() {
    this.stopConnection();
  }

  private createConnection() {
    try {
      this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7098/chatHub')
      .build();
    } catch (err) {
      console.log(err)
    }

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.isConnected.next(true);
      })
      .catch(err => console.log('Error while starting connection: ' + err));
    
    this.hubConnection.onclose(error => {
      this.isConnected.next(false);
      if (this.username) {
        setTimeout(() => this.startConnection(), 1000); 
      }
    });
    
    this.hubConnection.onreconnecting(() => {
      console.log("Attempting to reconnect");
    })
    
    this.hubConnection.onreconnected(() => {
      console.log("Reconnected");
      this.isConnected.next(true)
    })
  }

  getHubConnection = (): HubConnection => {
    return this.hubConnection
  }

  startConnection = () => {
    if(this.hubConnection.state === HubConnectionState.Disconnected) {
      this.hubConnection.start()
    }

  }

  private stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log("Connection stopped");
        this.isConnected.next(false);
      }).catch(err => console.error("Error while stopping connection: " + err));
    }
  }
}
