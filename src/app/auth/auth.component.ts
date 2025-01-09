import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [RouterModule, CommonModule]
})
export class AuthComponent {

}
