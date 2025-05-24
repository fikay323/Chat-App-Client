export interface IMessagingService {
  requestPermission(): Promise<string>;
  
  listen(callback: (payload: any) => void): void;
}
