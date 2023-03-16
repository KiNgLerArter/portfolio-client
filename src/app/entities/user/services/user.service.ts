import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ApiService } from "@basic/api";
import { AuthService } from "@shared/lib/auth";

import { User } from "../models";

@Injectable({
  providedIn: "root"
})
export class UserService extends ApiService {
  private _allUsers$ = new BehaviorSubject<User[]>([]);

  currentUser$ = new BehaviorSubject<User>(null);

  get currentUser(): User {
    return this.currentUser$.value;
  }

  get allUsers$(): Observable<User[]> {
    return this._allUsers$.asObservable();
  }

  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http, "users");

    this.initSubs();
  }

  private initSubs(): void {}

  clearUsers(): void {
    this._allUsers$.next([]);
  }

  fetchUserById(userId: number): Observable<User> {
    return this.get<User>(userId.toString()).pipe(
      catchError((error) => {
        console.log("[getUserById error]: ", error);
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
        console.log("[getUsers error]: ", error);
        return of([]);
      })
    );
  }

  getUserById(id: number): User {
    return this._allUsers$.value.find((user) => user.id === id);
  }
}
