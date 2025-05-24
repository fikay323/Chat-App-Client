import { Routes } from '@angular/router';
import { ChatComponent } from './presentation/chat/chat.component';
import { AuthComponent } from './presentation/auth/auth.component';
import { LoginComponent } from './presentation/auth/login/login.component';
import { RegisterComponent } from './presentation/auth/register/register.component';
import { chatGuard } from './presentation/shared/guards/chat.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent, children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
    ]},
    { path: 'chat', component: ChatComponent, canActivate: [chatGuard] }
];