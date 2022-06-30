import { Component, Inject, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ChatsService } from "@components/features/chat/services/chats.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { DialogData } from "@services/dialog/models/dialog.model";
import { UsersService } from "@services/users/users.service";
import { User } from "@shared/models/users.model";
import { tap } from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: "app-create-chat",
  templateUrl: "./create-chat.component.html",
  styleUrls: ["./create-chat.component.scss"]
})
export class CreateChatComponent implements OnInit {
  form: UntypedFormGroup;
  users: User[] = [];
  chatNameCtrl: UntypedFormControl;
  usersIdsCtrl: UntypedFormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CreateChatComponent>,
    private fb: UntypedFormBuilder,
    private chatsService: ChatsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  private initVars(): void {
    this.form = this.fb.group({
      chatName: ["", Validators.required],
      usersIds: [[], Validators.required]
    });

    this.chatNameCtrl = this.form.get("chatName") as UntypedFormControl;
    this.usersIdsCtrl = this.form.get("usersIds") as UntypedFormControl;
  }

  private initSubs(): void {
    this.usersService.allUsers$
      .pipe(
        untilDestroyed(this),
        tap((users) => {
          this.users = users.filter(
            (user) => user.id !== this.usersService.currentUser.id
          );
        })
      )
      .subscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createChat(): void {
    const { chatName, usersIds } = this.form.value;
    if (this.form.valid) {
      usersIds.push(this.usersService.currentUser.id);
      this.chatsService
        .createChat({ name: chatName, usersIds })
        .pipe(
          untilDestroyed(this),
          tap(() => {
            // this.closeDialog();
          })
        )
        .subscribe();
    }
  }
}
