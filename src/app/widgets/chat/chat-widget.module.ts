import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";

import { ChatFeaturesModule } from "@features/chat";

import { ChatBodyComponent, ChatComponent, ChatHeaderComponent } from "./ui";

const declarationsToExport = [
  ChatBodyComponent,
  ChatHeaderComponent,
  ChatComponent
];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
    ChatFeaturesModule
  ],
  exports: [...declarationsToExport, ChatFeaturesModule]
})
export class ChatWidgetModule {}
