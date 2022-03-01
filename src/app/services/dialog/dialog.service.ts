import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogData } from './@types/dialog.model';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open(
    config: MatDialogConfig<DialogData> = {
      data: {
        title: '',
        text: '',
        actions: { cancel: { text: 'cancel' }, accept: { text: 'ok' } },
      },
      width: '400px',
      height: '200px',
    }
  ) {
    this.dialog.open(DialogBodyComponent, config);
  }
}
