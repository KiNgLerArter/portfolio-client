import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AuthService } from "@services/auth/auth.service";
import { tap } from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isChat: boolean;
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initSubs();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  toggleChat(): void {
    this.isChat = !this.isChat;
    this.cdr.markForCheck();
  }

  private initSubs(): void {
    this.authService.isLoggedIn$
      .pipe(
        tap((value) => {
          this.isLoggedIn = value;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
}
