import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { AuthService } from "@shared/modules/auth";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {
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

  register(event: Event): void {
    event.preventDefault();

    this.authService.register(this.form.value).subscribe();
  }
}
