import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface IAuthService {
  signUp(user: User): Promise<any>;

  login(user: User, options?: { autologin: boolean }): Promise<any>;

  authSignalRHandlers(): void;

  logOut(): void;

  autoLogin(): void;

  getUnreadMessages(): void;

  userConnected$: Observable<User | null>;

  errorMessage$: Observable<string | null>;
  
  isFetching$: Observable<boolean>;
}
