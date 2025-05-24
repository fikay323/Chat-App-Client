import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../infrastructure/auth/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent, AlertComponent, RouterModule]
})
export class RegisterComponent {
  isFetching = false
  errorMessage: string

  constructor(private readonly authService: AuthService){}

  ngOnInit() {
    this.authService.isFetching$.subscribe(value => {
      this.isFetching = value
    })
    this.authService.errorMessage$.subscribe(value => {
      this.errorMessage = value
    })
  }

  register(registerForm: NgForm) {
    if(!registerForm.valid) return
    this.authService.isFetching$.next(true)
    const user = {
      username: registerForm.value.username,
      password: registerForm.value.password
    }
    this.authService.signUp(user)
  }

  closeAlertComponent() {
    this.errorMessage = null
  }
}