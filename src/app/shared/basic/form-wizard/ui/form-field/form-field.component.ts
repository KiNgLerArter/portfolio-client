import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormControl } from "@angular/forms";
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
export class FormFieldComponent<T> implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() initialValue: T;

  formControl: FormControl<T>;

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

    const isMorePriorErrors = this.config.validators.some(
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
    const validators = this.config.validators.map(
      (validatorConfig) => validatorConfig.validator
    );
    this.formControl = new FormControl(this.initialValue, validators);
  }
}
