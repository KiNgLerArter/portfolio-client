import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
})
export class PasswordFieldComponent implements OnInit {
  @Input() form: FormGroup;

  get control(): FormControl {
    return (this.form.get('password') as FormControl) ?? null;
  }

  constructor() {}

  ngOnInit(): void {
    this.form.addControl(
      'password',
      new FormControl(null, [Validators.required, Validators.maxLength(16)])
    );
  }
}
