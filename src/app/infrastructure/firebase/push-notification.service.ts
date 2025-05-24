import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly messaging: Messaging;

  constructor(private readonly http: HttpClient) {
    const firebaseApp = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(firebaseApp);
  }

  /**
   * Requests user permission and returns a Promise with FCM token
   */
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted.');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });

      if (!token) {
        console.warn('No registration token available.');
        return null;
      }

      return token;
    } catch (error) {
      console.error('Failed to get permission or token', error);
      return null;
    }
  }

  /**
   * Registers the FCM token with your backend
   */
  registerTokenWithBackend(userId: string, token: string): void {
    const payload = { userId, token };
    this.http.post('/api/notifications/register-token', payload).subscribe({
      next: () => console.log('Token registered with backend'),
      error: err => console.error('Failed to register token', err)
    });
  }

  /**
   * Listens for foreground messages
   */
  listenToMessages(): void {
    onMessage(this.messaging, (payload) => {
      console.log('📨 Foreground message received:', payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
        alert(`${title}\n${body}`);
      }
    });
  }
}
