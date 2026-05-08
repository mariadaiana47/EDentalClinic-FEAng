import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../auth';

/**
 * Daca pacientul are inca parola temporara, e fortat sa o schimbe inainte de orice ruta protejata.
 * UC III "Schimbare parola temporara".
 */
export const passwordChangedGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.mustChangePassword()) {
    router.navigate(['/auth/change-password']);
    return false;
  }
  return true;
};
