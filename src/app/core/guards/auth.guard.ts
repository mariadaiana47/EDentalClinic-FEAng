import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../auth';

/** Permite accesul doar daca utilizatorul are token salvat. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
