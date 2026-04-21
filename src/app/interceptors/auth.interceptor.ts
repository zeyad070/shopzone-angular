import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type { User } from '../models/user.model';
import { STORAGE_KEYS } from '../core/constants/api.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userId = localStorage.getItem(STORAGE_KEYS.userId);

  const clonedReq =
    userId && !req.headers.has('Authorization')
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${userId}`,
          },
        })
      : req;

  return next(clonedReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && req.url.includes('/users') && req.method === 'GET') {
        const users = event.body as User[];
        if (users && users.length > 0) {
          const user = users[0];
          localStorage.setItem(STORAGE_KEYS.userId, user.id.toString());
          localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
        }
      }
    }),
  );
};
