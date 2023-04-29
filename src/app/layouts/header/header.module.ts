import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";

import { ChatWidgetModule } from "@widgets/chat";

import { HeaderComponent } from "./ui";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    ChatWidgetModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {}
