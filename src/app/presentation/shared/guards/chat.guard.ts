import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';

import { AuthService } from '../../../infrastructure/auth/auth.service';

export const chatGuard = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userConnected$.pipe(
    take(1),
    map(user => {
      if(user) return true;
      return router.createUrlTree(['auth', 'login']);
    })
  )
};
