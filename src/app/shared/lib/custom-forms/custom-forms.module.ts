import { NgModule } from "@angular/core";

import { FormWizardModule } from "@basic/form-wizard";

import { EmailFieldComponent } from "./ui/email-field/email-field.component";
import { NicknameFieldComponent } from "./ui/nickname-field/nickname-field.component";
import { PasswordFieldComponent } from "./ui/password-field/password-field.component";

const declarationsToExport = [
  EmailFieldComponent,
  NicknameFieldComponent,
  PasswordFieldComponent
];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [FormWizardModule],
  exports: [...declarationsToExport]
})
export class CustomFormsModule {}
