import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormFieldComponent } from "@basic/form-wizard/ui";
import { formFieldsConfigs } from "../../config";
import { Fields } from "../../models";

@Component({
  selector: "app-email-field",
  templateUrl:
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.html",
  styleUrls: [
    "../../../../../basic/form-wizard/ui/form-field/form-field.component.scss",
    "./email-field.component.scss"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailFieldComponent extends FormFieldComponent<string> {
  CONFIG = formFieldsConfigs.email;
  INITIAL_VALUE = "";
  FORM_KEY = Fields.EMAIL;
}
