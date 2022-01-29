import { Component, OnInit } from '@angular/core';
import { GlobalLoaderService } from '@components/features/global-loader/service/global-loader.service';
import { Auth } from '@shared/@types/auth.model';
import { AuthService } from '@services/auth/auth.service';
import { UsersService } from '@services/users/users.service';

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
  }
}
