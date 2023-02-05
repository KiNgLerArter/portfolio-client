import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map, pairwise, tap } from "rxjs/operators";
import { ApiService } from "@shared/base-modules/api";
import { Auth, AuthRes, UserDto } from "../models";

@Injectable({
  providedIn: "root"
})
export class AuthService extends ApiService {
  private _accessToken$ = new BehaviorSubject<string>(null);
  private _currentUserId$ = new BehaviorSubject<number>(null);

  currentUserId$ = this._currentUserId$.asObservable();
  isLoggedIn$ = this._accessToken$.pipe(map((token) => !!token));

  constructor(protected http: HttpClient, private router: Router) {
    super(http, "auth");

    this.initSubs();
  }

  getCurrentUserId(): number {
    return this._currentUserId$.value;
  }

  getAccessToken(): string {
    return this._accessToken$.value;
  }

  register(data: UserDto & { nickname: string }): Observable<AuthRes> {
    return this.post<AuthRes>("register", { body: data }).pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error("[register error]:", error.message);
        return of(null);
      })
    );
  }

  login(data: UserDto): Observable<AuthRes> {
    return this.post<AuthRes>("login", { body: data }).pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error("[login error]:", error.message);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return this.get<void>("logout").pipe(
      finalize(() => {
        this.clearCredentials();
      })
    );
  }

  refreshToken(): Observable<AuthRes> {
    return this.get<AuthRes>("refresh").pipe(
      tap(({ accessToken, user: { id } }) => {
        this.setCredentials(accessToken, id);
      }),
      catchError((error) => {
        console.error("[refresh error]:", error);
        return of(null);
      })
    );
  }

  private initSubs(): void {
    this._accessToken$
      .pipe(
        pairwise(),
        tap(([prev, next]) => {
          if (!prev && next) {
            this.router.navigate(["/home"]);
          } else if (prev && !next) {
            this.router.navigate(["/login"]);
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
}
