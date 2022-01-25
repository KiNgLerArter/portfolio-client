import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject(false);

  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  constructor() {}

  login({ email, password }: { email: string; password: string }) {
    console.log('[email]:', email);
  }

  logout() {}

  register({ email, password }: { email: string; password: string }) {}
}
