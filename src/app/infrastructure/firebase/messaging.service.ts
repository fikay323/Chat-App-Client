import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { IMessagingService } from '../../core/interfaces/messaging.service.interface';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class FirebaseMessagingService implements IMessagingService {
  private readonly messaging = getMessaging(initializeApp(environment.firebaseConfig));

  async requestPermission(): Promise<string> {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Notification permission denied');

    const token = await getToken(this.messaging, { vapidKey: environment.vapidKey });
    return token;
  }

  listen(callback: (payload: any) => void): void {
    onMessage(this.messaging, callback);
  }
}
