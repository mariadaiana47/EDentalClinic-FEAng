import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, Role } from '../auth';


export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const allowed = (route.data?.['roles'] ?? []) as Role[];
  const current = auth.currentRole();

  console.log('[RoleGuard] Checking access:', { path: route.routeConfig?.path, allowed, current });

  if (current && allowed.includes(current)) return true;

  if (current) {
    const target = dashboardForRole(current);
    console.warn('[RoleGuard] Unauthorized. Redirecting to dashboard:', target);
    router.navigate([target]);
    return false;
  }

  console.warn('[RoleGuard] No session. Redirecting to login.');
  router.navigate(['/login']);
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
