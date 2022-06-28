import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header.component";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { ChatModule } from "@components/features/chat/chat.module";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    ChatModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {}
