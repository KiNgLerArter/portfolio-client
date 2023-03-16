import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AuthFeaturesModule } from "@features/auth";

@Component({
  standalone: true,
  selector: "app-registration-page",
  templateUrl: "./registration-page.component.html",
  styleUrls: ["./registration-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFeaturesModule]
})
export class RegistrationPageComponent {}
