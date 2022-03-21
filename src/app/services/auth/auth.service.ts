import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalLoaderService } from '@components/features/global-loader/service/global-loader.service';
import { ApiService } from '@services/api/api.service';
import { UsersService } from '@services/users/users.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, pairwise, tap } from 'rxjs/operators';
import { Auth, AuthRes, UserDto } from '../../shared/@types/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  private _accessToken$ = new BehaviorSubject<string>(null);
  private _currentUserId$ = new BehaviorSubject<number>(null);

  get accessToken(): string {
    return this._accessToken$.value;
  }

  get currentUserId$(): Observable<number> {
    return this._currentUserId$.asObservable();
  }

  get currentUserId(): number {
    return this._currentUserId$.value;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._accessToken$.pipe(map((token) => !!token));
  }

  get isLoggedIn(): boolean {
    return !!this._accessToken$.value;
  }

  constructor(protected http: HttpClient, private router: Router) {
    super(http, 'auth');

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

  private setCredentials(token: string, id: number): void {
    this._currentUserId$.next(id);
    localStorage.setItem(Auth.accessToken, token);
    this._accessToken$.next(token);
  }

  private clearCredentials(): void {
    this._currentUserId$.next(null);
    localStorage.removeItem(Auth.accessToken);
    this._accessToken$.next(null);
  }

  register(data: UserDto & { nickname: string }): Observable<AuthRes> {
    return this.post<AuthRes>('register', {body: data}).pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error('[register error]:', error.message);
        return of(null);
      })
    );
  }

  login(data: UserDto): Observable<AuthRes> {
    return this.post<AuthRes>('login', {body: data}).pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error('[login error]:', error.message);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.get<void>('logout').pipe(
      finalize(() => {
        this.clearCredentials();
      })
    );
  }

  refreshToken(): Observable<AuthRes> {
    return this.get<AuthRes>('refresh').pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error('[refresh error]:', error);
        return of(null);
      })
    );
  }
}
