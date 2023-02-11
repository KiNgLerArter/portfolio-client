import { Component, Inject, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { tap } from "rxjs/operators";
import { User, UserService } from "@entities/user";
import { DialogData } from "@shared/lib/material-design/dialog";
import { ChatService } from "@entities/chat";

@UntilDestroy()
@Component({
  selector: "app-create-chat-dialog",
  templateUrl: "./create-chat-dialog.component.html",
  styleUrls: ["./create-chat-dialog.component.scss"]
})
export class CreateChatDialogComponent implements OnInit {
  form: UntypedFormGroup;
  users: User[] = [];
  chatNameCtrl: UntypedFormControl;
  usersIdsCtrl: UntypedFormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    private fb: UntypedFormBuilder,
    private chatService: ChatService,
    private userService: UserService
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
    this.userService.allUsers$
      .pipe(
        untilDestroyed(this),
        tap((users) => {
          this.users = users.filter(
            (user) => user.id !== this.userService.currentUser.id
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
      usersIds.push(this.userService.currentUser.id);
      this.chatService
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
