import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailFieldComponent } from './email-field/email-field.component';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NicknameFieldComponent } from './nickname-field/nickname-field.component';

const declarationsToExport = [
  EmailFieldComponent,
  PasswordFieldComponent,
  NicknameFieldComponent,
];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [...declarationsToExport],
})
export class FormFieldsModule {}
