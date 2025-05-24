import { HubConnection } from '@microsoft/signalr';

export interface ISignalRService {
  initialize(username: string): void;

  destroy(): void;

  startConnection(): Promise<void>;
  
  getHubConnection(): HubConnection;
}
