import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-form-group",
  templateUrl: "./form-group.component.html",
  styleUrls: ["./form-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent {}
