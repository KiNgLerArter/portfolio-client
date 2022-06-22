import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_LOADER } from '@services/api/config/api.config';
import { AuthService } from '@services/auth/auth.service';
import { GlobalLoaderService } from '@services/global-loader/global-loader.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private globalLoaderService: GlobalLoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(IS_LOADER)) {
      this.globalLoaderService.setLoading(true);
    }

    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleResError(error, req, next);
      }),
      finalize(() => {
        this.globalLoaderService.setLoading(false);
      })
    );
  }

  private handleResError(
    error: any,
    prevReq?: HttpRequest<any>,
    next?: HttpHandler
  ): Observable<any> {
    if (error.status === 401 && !error.url.includes('auth/refresh')) {
      return this.authService.refreshToken().pipe(
        catchError((error) => {
          return this.authService.logout();
        }),
        switchMap(() => {
          prevReq = this.addAuthHeader(prevReq);
          return next.handle(prevReq);
        })
      );
    }

    return throwError(error);
  }

  private addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });
  }
}
