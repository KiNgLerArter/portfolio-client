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
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loaderService: GlobalLoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.isLoading = true;
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${this.authService.accessToken}` },
    });

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.loaderService.isLoading = false;
        }
      })
    );
  }
}
