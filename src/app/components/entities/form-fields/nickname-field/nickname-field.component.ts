import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nickname-field',
  templateUrl: './nickname-field.component.html',
  styleUrls: ['./nickname-field.component.scss'],
})
export class NicknameFieldComponent implements OnInit {
  @Input() form: UntypedFormGroup;

  get control(): UntypedFormControl {
    return (this.form.get('nickname') as UntypedFormControl) ?? null;
  }

  constructor() {}

  ngOnInit(): void {
    this.form.addControl(
      'nickname',
      new UntypedFormControl(null, [Validators.required])
    );
  }
}
