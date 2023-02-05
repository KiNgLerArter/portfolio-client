import { Component, OnInit } from "@angular/core";
import { filter, switchMap, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Auth, AuthService } from "@shared/modules/auth";
import { UserService } from "@entities/user";
import { GlobalLoaderService } from "@shared/modules/global-loader";

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
