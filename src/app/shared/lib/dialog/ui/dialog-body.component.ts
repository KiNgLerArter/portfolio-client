import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../models/dialog.model";

@Component({
  selector: "app-dialog-body",
  templateUrl: "./dialog-body.component.html",
  styleUrls: ["./dialog-body.component.scss"]
})
export class DialogBodyComponent {
  constructor(
    // public dialogRef: MatDialogRef<DialogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
