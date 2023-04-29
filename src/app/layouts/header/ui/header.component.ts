import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef
} from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { tap } from "rxjs/operators";

import { ChatService } from "@entities/chat";
import { ChatViewType } from "@entities/chat/models";
import { AuthService } from "@shared/lib/auth";
import { FullscreenChatComponent } from "@widgets/chat";

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
    private cdr: ChangeDetectorRef,
    private chatService: ChatService,
    private viewContainerRef: ViewContainerRef
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

  //Rename widget chat to dropdown-chat and create new fullscreen-chat
  openFullscreenChat(): void {
    console.log("[openFullscreenChat]");
    this.toggleChat();
    this.chatService.setView<FullscreenChatComponent>({
      type: ChatViewType.FULL,
      component: this.viewContainerRef.createComponent(FullscreenChatComponent)
    });
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
