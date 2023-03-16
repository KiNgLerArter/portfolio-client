import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

import { UserService } from "@entities/user";
import { Auth, AuthService } from "@shared/lib/auth";
import { GlobalLoaderService } from "@shared/lib/loader";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private loaderService: GlobalLoaderService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;

    if (localStorage.getItem(Auth.accessToken)) {
      this.authService.refreshToken().subscribe();
    }

    this.authService.isLoggedIn$
      .pipe(
        tap((isLoggedIn) => !isLoggedIn && this.userService.clearUsers()),
        filter(Boolean),
        switchMap(() => this.userService.fetchUsers()),
        tap(() => {
          this.userService.currentUser$.next(
            this.userService.getUserById(this.authService.getCurrentUserId())
          );
        })
      )
      .subscribe();
  }
}
