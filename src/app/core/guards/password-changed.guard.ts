import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../auth';


export const passwordChangedGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.mustChangePassword()) {
    router.navigate(['/change-password']);
    return false;
  }
  return true;
};
