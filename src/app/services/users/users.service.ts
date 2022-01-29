import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../shared/@types/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService {
  constructor(protected http: HttpClient) {
    super(http, 'users');
  }

  getUsers(): Observable<User[]> {
    return this.get<User[]>().pipe(
      tap((res) => {
        console.log('[res]:', res);
      })
    );
  }
}
