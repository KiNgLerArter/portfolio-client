import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormFieldComponent, FormGroupComponent } from "./ui";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";

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
