import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';
import { SignalRService } from './signal-r.service';

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
    this.signalRService.startConnection()
    this.authService.autoLogin()
  }
}