import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly toastr: ToastrService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.resolveMessage(error);
        this.toastr.error(message, 'Something went wrong');
        return throwError(() => error);
      }),
    );
  }

  private resolveMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.length > 0) {
      return error.error;
    }
    if (error.error && typeof error.error === 'object') {
      const e = error.error as Record<string, unknown>;
      if (typeof e['message'] === 'string') {
        return e['message'];
      }
    }
    if (error.status === 0) {
      return 'Cannot reach the API. Is JSON Server running on port 3000?';
    }
    if (error.status === 404) {
      return 'We could not find that resource.';
    }
    if (error.status === 400) {
      return 'The server could not process this request. Please check your input.';
    }
    if (error.status === 401) {
      return 'You are not authorized to perform this action.';
    }
    if (error.status >= 500) {
      return 'The server is temporarily unavailable. Please try again in a moment.';
    }
    return error.message || 'Unexpected error';
  }
}
