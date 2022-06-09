import { Component, OnInit } from '@angular/core';
import { Auth } from '@shared/models/auth.model';
import { AuthService } from '@services/auth/auth.service';
import { UsersService } from '@services/users/users.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlobalLoaderService } from '@services/global-loader/global-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private loaderService: GlobalLoaderService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;

    if (localStorage.getItem(Auth.accessToken)) {
      this.authService.refreshToken().subscribe();
    }

    this.authService.isLoggedIn$
      .pipe(
        filter((isLoggedIn) => {
          console.log('[isLoggedIn]: ', isLoggedIn);
          if (!isLoggedIn) {
            this.usersService.clearUsers();
            return false;
          }
          return true;
        }),
        switchMap(() => this.usersService.fetchUsers()),
        tap(() => {
          this.usersService.currentUser$.next(
            this.usersService.getUserById(this.authService.currentUserId)
          );
        })
      )
      .subscribe();
  }
}
