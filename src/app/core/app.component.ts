import { Component, OnInit } from '@angular/core';
import { GlobalLoaderService } from '@components/features/global-loader/service/global-loader.service';
import { Auth } from '@shared/model/auth.model';
import { AuthService } from '@services/auth/auth.service';
import { UsersService } from '@services/users/users.service';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  get isLoading(): boolean {
    return this.loaderService.isLoading;
  }

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private loaderService: GlobalLoaderService
  ) {}

  ngOnInit(): void {
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
