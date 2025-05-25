import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { ISignalRService } from '../../core/interfaces/signalr.service.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements ISignalRService {
  private hubConnection: HubConnection;
  private readonly isConnected = new BehaviorSubject<boolean>(false);
  private readonly baseApiUrl = environment.baseApiUrl;

  constructor() {}

  createConnection() {
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
    return this.hubConnection;
  }

  getConnectionStatus() {
    return this.isConnected.asObservable();
  }
}
