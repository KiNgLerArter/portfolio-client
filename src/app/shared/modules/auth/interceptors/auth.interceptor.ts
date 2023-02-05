import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IS_LOADER } from "@shared/base-modules/api";
import { GlobalLoaderService } from "@shared/modules/global-loader";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";
import { AuthService } from "../services";

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
      catchError((error) => this.handleResError(error, req, next)),
      finalize(() => this.globalLoaderService.setLoading(false))
    );
  }

  private handleResError(
    error: any,
    prevReq?: HttpRequest<any>,
    next?: HttpHandler
  ): Observable<any> {
    if (error.status !== 401 || error.url.includes("auth/refresh")) {
      return throwError(() => error);
    }

    return this.authService.refreshToken().pipe(
      catchError(() => {
        return this.authService.logout();
      }),
      switchMap(() => {
        prevReq = this.addAuthHeader(prevReq);
        return next.handle(prevReq);
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`
      }
    });
  }
}
