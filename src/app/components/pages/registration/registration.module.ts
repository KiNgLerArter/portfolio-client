import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegistrationComponent } from "./registration.component";
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "@components/entities/form-fields/form-fields.module";
import { RegistrationRoutingModule } from "./registration-routing.module";

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    MatButtonModule,
    FormFieldsModule
  ]
})
export class RegistrationModule {}
