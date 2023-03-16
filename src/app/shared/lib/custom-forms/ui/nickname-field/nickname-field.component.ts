import { ChangeDetectionStrategy, Component } from "@angular/core";

import { FormFieldComponent } from "@basic/form-wizard/ui";

import { formFieldsConfigs } from "../../config";
import { Fields } from "../../models";

@Component({
  selector: "app-nickname-field",
  templateUrl:
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.html",
  styleUrls: [
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.scss",
    "./nickname-field.component.scss"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NicknameFieldComponent extends FormFieldComponent<string> {
  CONFIG = formFieldsConfigs.nickname;
  INITIAL_VALUE = "";
  FORM_KEY = Fields.NICK;
}
