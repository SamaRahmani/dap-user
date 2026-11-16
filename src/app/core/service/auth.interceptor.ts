
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRequest = req.url.includes('/api/auth/');

  // Public DAP calculation endpoint does not require authentication.
  const isPublicDapRequest =
    req.url.includes('/api/v1/dap/calculate');

  const accessToken = authService.getAccessToken();

  // Do not attach JWT or attempt token refresh for public/auth requests.
  if (isAuthRequest || isPublicDapRequest || !accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap(newAccessToken => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`
            }
          });

          return next(retryReq);
        }),
        catchError(refreshError => {
          authService.clearSession();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
