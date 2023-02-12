import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { ChatBodyComponent, ChatHeaderComponent, ChatComponent } from "./ui";
import { ChatFeaturesModule } from "@features/chat";

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
