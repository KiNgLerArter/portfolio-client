import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogService } from '@services/dialog/dialog.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatInput = new FormControl();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  openCreateChatDialog(): void {
    this.dialogService.open();
  }
}
