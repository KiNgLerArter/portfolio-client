import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { AuthService } from "@services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({});
  }

  login(event: Event): void {
    event.preventDefault();

    this.authService.login(this.form.value).subscribe();
  }
}
