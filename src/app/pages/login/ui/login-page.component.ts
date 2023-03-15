import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AuthFeaturesModule } from "@features/auth";

@Component({
  standalone: true,
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFeaturesModule]
})
export class LoginPageComponent {}
