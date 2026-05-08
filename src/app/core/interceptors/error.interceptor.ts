import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../auth';

/**
 * Tratare globala a erorilor HTTP.
 * 401/403: invalideaza sesiunea si trimite la login.
 * 0: backend-ul nu raspunde — log doar; fiecare componenta poate afisa mesajul ei.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        // Token invalid sau expirat — logout si redirect la login
        if (!req.url.includes('/auth/login')) {
          auth.logout();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => err);
    }),
  );
};
