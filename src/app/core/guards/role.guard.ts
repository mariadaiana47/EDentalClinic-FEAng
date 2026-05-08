import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, Role } from '../auth';

/**
 * Permite accesul doar daca rolul curent e in lista din `data.roles`.
 * Folosire in routes: { path: 'doctor', canActivate: [authGuard, roleGuard], data: { roles: ['DOCTOR'] } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const allowed = (route.data?.['roles'] ?? []) as Role[];
  const current = auth.currentRole();

  if (current && allowed.includes(current)) return true;

  // fallback: trimit utilizatorul la propriul dashboard daca e logat
  if (current) {
    router.navigate([dashboardForRole(current)]);
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};

function dashboardForRole(role: Role): string {
  switch (role) {
    case 'DOCTOR': return '/doctor';
    case 'PATIENT': return '/patient';
    case 'ASSISTANT': return '/assistant';
    case 'RADIOLOGIST': return '/radiologist';
  }
}
