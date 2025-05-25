import { HubConnection } from '@microsoft/signalr';

export interface ISignalRService {
  createConnection(): void;
  
  getHubConnection(): HubConnection;
}
