import { ChangeDetectionStrategy, Component } from "@angular/core";

import { FormFieldComponent } from "@basic/form-wizard/ui";

import { formFieldsConfigs } from "../../config";
import { Fields } from "../../models";

@Component({
  selector: "app-password-field",
  templateUrl:
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.html",
  styleUrls: [
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.scss",
    "./password-field.component.scss"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFieldComponent extends FormFieldComponent<string> {
  CONFIG = formFieldsConfigs.password;
  INITIAL_VALUE = "";
  FORM_KEY = Fields.PASS;
}
