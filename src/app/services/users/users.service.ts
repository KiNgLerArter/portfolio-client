import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '@components/features/header/services/chats/@types/chat.model';
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

  currentUser$ = new BehaviorSubject<User>(null);

  get currentUser(): User {
    return this.currentUser$.value;
  }

  get allUsers$(): Observable<User[]> {
    return this._allUsers$.asObservable();
  }

  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http, 'users');

    this.initSubs();
  }

  private initSubs(): void {}

  clearUsers(): void {
    this._allUsers$.next([]);
  }

  fetchUserById(userId: number): Observable<User> {
    return this.get<User>(userId.toString()).pipe(
      catchError((error) => {
        console.log('[getUserById error]: ', error);
        return of(null);
      })
    );
  }

  fetchUsers(): Observable<User[]> {
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

  getUserById(id: number): User {
    return this._allUsers$.value.find((user) => user.id === id);
  }
}
