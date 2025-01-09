import { Component } from '@angular/core';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatPageComponent, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
