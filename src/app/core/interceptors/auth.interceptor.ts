import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../auth';

/**
 * Ataseaza header-ul Authorization: Bearer <token> la cererile catre API,
 * exceptie face login-ul (token-ul nu exista la pas).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  // Endpoint-urile publice de auth nu primesc Authorization header
  const isAuthLogin = req.url.includes('/auth/login');
  const isAuthRegister = req.url.includes('/auth/register');

  if (token && !isAuthLogin && !isAuthRegister) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
