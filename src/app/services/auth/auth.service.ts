import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pairwise, tap } from 'rxjs/operators';
import { Auth, AuthRes, UserDto } from './@types/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  private _accessToken$ = new BehaviorSubject<string>(null);

  get accessToken(): string {
    return this._accessToken$.value;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._accessToken$.pipe(map((token) => !!token));
  }

  get isLoggedIn(): boolean {
    return !!this._accessToken$.value;
  }

  constructor(protected http: HttpClient, private router: Router) {
    super(http, 'auth');
    const token = localStorage.getItem(Auth.accessToken);
    if (token) {
      this._accessToken$.next(token);
    }

    this.initSubs();
  }

  private initSubs(): void {
    this._accessToken$
      .pipe(
        pairwise(),
        tap(([prev, next]) => {
          if (!prev && next) {
            this.router.navigate(['/home']);
          } else if (prev && !next) {
            this.router.navigate(['/login']);
          }
        })
      )
      .subscribe();
  }

  register(data: UserDto): Observable<AuthRes> {
    return this.post<AuthRes>('registration', data).pipe(
      tap(({ accessToken }) => {
        localStorage.setItem(Auth.accessToken, accessToken);
        this._accessToken$.next(accessToken);
      }),
      catchError((error) => {
        console.error('[register error]:', error.message);
        return of(null);
      })
    );
  }

  login(data: UserDto): Observable<AuthRes> {
    return this.post<AuthRes>('login', data).pipe(
      tap(({ accessToken }) => {
        localStorage.setItem(Auth.accessToken, accessToken);
        this._accessToken$.next(accessToken);
      }),
      catchError((error) => {
        console.error('[login error]:', error.message);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.get<void>('logout').pipe(
      tap(() => {
        localStorage.removeItem(Auth.accessToken);
        this._accessToken$.next(null);
      }),
      catchError((error) => {
        console.error('[logout error]:', error.message);
        return of(null);
      })
    );
  }

  refreshToken() {}
}
