import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalLoaderService } from '@components/features/global-loader/service/global-loader.service';
import { AuthService } from '@services/auth/auth.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loaderService: GlobalLoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.isLoading = true;
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleResError(error, req, next);
      }),
      finalize(() => {
        this.loaderService.isLoading = false;
      })
    );
  }

  private handleResError(
    error: any,
    req?: HttpRequest<any>,
    next?: HttpHandler
  ): Observable<any> {
    if (error.status === 401) {
      return this.authService.refreshToken().pipe(
        switchMap(() => {
          req = this.addAuthHeader(req);
          return next.handle(req);
        }),
        catchError((error) => {
          return this.authService.logout();
        })
      );
    }

    return throwError(error);
  }

  private addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${this.authService.accessToken}` },
    });
  }
}
