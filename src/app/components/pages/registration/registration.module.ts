import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { FormFieldsModule } from '@components/entities/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RegistrationComponent],
  imports: [CommonModule, MatButtonModule, FormFieldsModule],
})
export class RegistrationModule {}
