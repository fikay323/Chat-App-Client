import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './infrastructure/auth/auth.service';
import { SignalRService } from './infrastructure/signalr/signal-r.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  constructor(
    private readonly authService: AuthService, 
    private readonly signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.signalRService.createConnection();
    this.signalRService.getConnectionStatus()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: status => {
        status && this.authService.autoLogin();
      }
    })
    this.authService.authSignalRHandlers().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}