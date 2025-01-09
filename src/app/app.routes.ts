import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { chatGuard } from './chat/chat.guard';
import { ChatResolver } from './chat.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent, children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
    ]},
    // { path: 'chat', component: ChatComponent, canActivate: [chatGuard], resolve: [ChatResolver] },
    { path: 'chat', component: ChatComponent, canActivate: [chatGuard] }
];