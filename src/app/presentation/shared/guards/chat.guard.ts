import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../infrastructure/auth/auth.service';

export const chatGuard = (route, state) => {
  return inject(AuthService).userConnected$.subscribe(value => {
    if(value) {
      return true
    } else {
      return inject(Router).navigate(['auth/login'])
    }
  })
};
