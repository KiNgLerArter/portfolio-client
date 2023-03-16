import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CustomFormsModule } from "@shared/lib/custom-forms";

import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";

const declarationsToExport = [LoginComponent, RegisterComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, FormsModule, CustomFormsModule],
  exports: [...declarationsToExport]
})
export class AuthFeaturesModule {}
