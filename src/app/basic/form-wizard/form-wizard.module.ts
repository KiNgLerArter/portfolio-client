import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";

import { FormFieldComponent, FormGroupComponent } from "./ui";

const declarationsToExport: any[] = [FormFieldComponent, FormGroupComponent];
const importsToExport = [
  CommonModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule
];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [...importsToExport],
  exports: [...declarationsToExport, ...importsToExport]
})
export class FormWizardModule {}
