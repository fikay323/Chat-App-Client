import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { FirebaseMessagingService } from '../../infrastructure/firebase/messaging.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
    private readonly baseApiUrl = environment.baseApiUrl; 
    constructor(
        private readonly messagingService: FirebaseMessagingService,
        private readonly authService: AuthService,
        private readonly http: HttpClient
    ) { }

    async registerForNotifications(): Promise<void> {
        try {
            const token = await this.messagingService.requestPermission();

            await firstValueFrom(this.http.post(this.baseApiUrl + 'api/notifications/register-token', {
                userId: this.authService.getUserId(),
                token
            })).then(() => {
                console.log('FCM token registered with backend');
            });
        } catch (err) {
            console.error('Push Notification Error:', err);
        }
    }

    subscribeToForegroundMessages(callback: (payload: any) => void): void {
        this.messagingService.listen(callback);
    }
}
