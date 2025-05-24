import { Component } from '@angular/core';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationFacade } from '../../application/notification/notification.facade';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatPageComponent, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private readonly notificationFacade: NotificationFacade) {}

  async ngOnInit() {
    await this.notificationFacade.registerForNotifications();
    this.notificationFacade.subscribeToForegroundMessages((payload) => {
      console.log('📩 New Push Notification:', payload);
      // Optionally show in-app notification
    });
  }
}
