import { Component, Input, OnInit } from "@angular/core";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-password-field",
  templateUrl: "./password-field.component.html",
  styleUrls: ["./password-field.component.scss"]
})
export class PasswordFieldComponent implements OnInit {
  @Input() form: UntypedFormGroup;

  get control(): UntypedFormControl {
    return (this.form.get("password") as UntypedFormControl) ?? null;
  }

  ngOnInit(): void {
    this.form.addControl(
      "password",
      new UntypedFormControl(null, [
        Validators.required,
        Validators.maxLength(16)
      ])
    );
  }
}
