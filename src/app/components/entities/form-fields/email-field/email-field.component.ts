import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-field',
  templateUrl: './email-field.component.html',
  styleUrls: ['./email-field.component.scss'],
})
export class EmailFieldComponent implements OnInit {
  @Input() form: FormGroup;

  get control(): FormControl {
    return (this.form.get('email') as FormControl) ?? null;
  }

  constructor() {}

  ngOnInit(): void {
    this.form.addControl(
      'email',
      new FormControl(null, [Validators.required, Validators.email])
    );
  }
}
