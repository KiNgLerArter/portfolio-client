import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import {
  ErrorMessagePriority,
  FieldType,
  FormFieldConfig,
  FormFieldValidator
} from "../../models";

@Component({
  selector: "app-form-field",
  templateUrl: "./form-field.component.html",
  styleUrls: ["./form-field.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class FormFieldComponent<T> implements OnInit {
  @Input() form: FormGroup;

  formControl: FormControl<T>;

  abstract readonly FORM_KEY: string;
  abstract readonly CONFIG: FormFieldConfig;
  abstract readonly INITIAL_VALUE: T;
  readonly FIELD_TYPE = FieldType;

  ngOnInit(): void {
    this.initVariables();
  }

  showError({ error }: FormFieldValidator): boolean {
    if (error.priority === ErrorMessagePriority.ALWAYS) {
      return true;
    } else if (
      error.priority === ErrorMessagePriority.ONLY &&
      Object.keys(this.formControl.errors).length === 1
    ) {
      return true;
    }

    const isMorePriorErrors = this.CONFIG.validators.some(
      ({ error: configError }) =>
        configError.priority < error.priority &&
        this.formControl.hasError(configError.errorKey)
    );
    return !isMorePriorErrors && this.formControl.hasError(error.errorKey);
  }

  identifyError(_: number, { error }: FormFieldValidator): string {
    return error.errorKey;
  }

  private initVariables(): void {
    const validators = this.CONFIG.validators.map(
      (validatorConfig) => validatorConfig.validator
    );
    this.formControl = new FormControl(this.INITIAL_VALUE, validators);
    this.form.addControl(this.FORM_KEY, this.formControl);
  }
}
