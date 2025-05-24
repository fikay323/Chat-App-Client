import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './infrastructure/auth/auth.service';
import { ChatService } from './infrastructure/chat/chat.service';
import { SignalRService } from './infrastructure/signalr/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  standalone: true
})
export class AppComponent {
  
  constructor(private router: Router, private authService: AuthService, private signalRService: SignalRService) {}

  ngOnInit() {
    this.signalRService.startConnection().then(e => {
      this.authService.autoLogin()
    })
  }
}