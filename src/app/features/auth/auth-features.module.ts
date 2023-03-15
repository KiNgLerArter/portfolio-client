import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { CustomFormsModule } from "@shared/lib/custom-forms";
import { FormsModule } from "@angular/forms";

const declarationsToExport = [LoginComponent, RegisterComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, FormsModule, CustomFormsModule],
  exports: [...declarationsToExport]
})
export class AuthFeaturesModule {}
