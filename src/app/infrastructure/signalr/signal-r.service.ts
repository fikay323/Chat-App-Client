import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { ISignalRService } from '../../core/interfaces/signalr.service.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements ISignalRService {
  private hubConnection: HubConnection;
  private readonly isConnected = new BehaviorSubject<boolean>(false);
  username: string;
  private readonly baseApiUrl = environment.baseApiUrl ;

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
      .withUrl(this.baseApiUrl + 'chatHub')
      .build();
    } catch (err) {
      console.log(err);
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
      return this.hubConnection.start()
    }
    return Promise.resolve()
  }

  private stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        this.isConnected.next(false);
      }).catch(err => console.error("Error while stopping connection: " + err));
    }
  }
}
