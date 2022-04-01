import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '@components/features/header/@types/chat.model';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { User } from '../../shared/@types/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService {
  private _allUsers$ = new BehaviorSubject<User[]>([]);
  private _currentUser$ = new BehaviorSubject<User>(null);

  get currentUser(): User {
    return this._currentUser$.value;
  }

  get allUsers$(): Observable<User[]> {
    return this._allUsers$.asObservable();
  }

  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http, 'users');

    this.initSubs();
  }

  private initSubs(): void {
    this.authService.isLoggedIn$
      .pipe(
        filter((isLoggedIn) => {
          console.log('[isLoggedIn]: ', isLoggedIn);
          if (!isLoggedIn) {
            this.clearUsers();
            return false;
          }
          return true;
        }),
        switchMap(() => this.getUserById(this.authService.currentUserId)),
        tap((user) => {
          console.log('[user]:', user);
        }),
        switchMap(() => this.getUsers())
      )
      .subscribe();
  }

  private clearUsers(): void {
    this._allUsers$.next([]);
  }

  getUserById(userId: number): Observable<User> {
    return this.get<User>(userId.toString()).pipe(
      tap((user) => {
        this._currentUser$.next(user);
      }),
      catchError((error) => {
        console.log('[getUserById error]: ', error);
        return of(null);
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.get<User[]>().pipe(
      tap((users) => {
        this._allUsers$.next(users);
      }),
      catchError((error) => {
        console.log('[getUsers error]: ', error);
        return of([]);
      })
    );
  }
}
