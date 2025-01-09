import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from '../alert/alert.component';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, LoadingSpinnerComponent, AlertComponent]
})
export class LoginComponent {
  // isFetching = this.authService.isFetching
  isFetching: boolean = false
  errorMessage: string

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isFetching.subscribe(value => {
      this.isFetching = value
    })
    this.authService.errorMessage.subscribe(value => {
      this.errorMessage = value
    })
  }

  login(loginForm: NgForm) {
    if(!loginForm.valid) return
    this.authService.isFetching.next(true)
    const user = {
      username: loginForm.value.username,
      password: loginForm.value.password
    }
    this.authService.login(user)
  }

  closeAlertComponent() {
    this.errorMessage = null
  }

}