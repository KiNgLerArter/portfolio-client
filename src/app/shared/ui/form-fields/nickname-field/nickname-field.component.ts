import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nickname-field',
  templateUrl: './nickname-field.component.html',
  styleUrls: ['./nickname-field.component.scss'],
})
export class NicknameFieldComponent implements OnInit {
  @Input() form: FormGroup;

  get control(): FormControl {
    return (this.form.get('nickname') as FormControl) ?? null;
  }

  constructor() {}

  ngOnInit(): void {
    this.form.addControl(
      'nickname',
      new FormControl(null, [Validators.required])
    );
  }
}
