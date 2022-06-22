import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-field',
  templateUrl: './email-field.component.html',
  styleUrls: ['./email-field.component.scss'],
})
export class EmailFieldComponent implements OnInit {
  @Input() form: UntypedFormGroup;

  get control(): UntypedFormControl {
    return (this.form.get('email') as UntypedFormControl) ?? null;
  }

  constructor() {}

  ngOnInit(): void {
    this.form.addControl(
      'email',
      new UntypedFormControl(null, [Validators.required, Validators.email])
    );
  }
}
