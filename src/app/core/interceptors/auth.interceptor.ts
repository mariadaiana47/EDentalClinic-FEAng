import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../auth';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  const isAuthLogin = req.url.endsWith('/auth/login');
  const isAuthRegister = req.url.endsWith('/auth/register');

  if (token && !isAuthLogin && !isAuthRegister) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
