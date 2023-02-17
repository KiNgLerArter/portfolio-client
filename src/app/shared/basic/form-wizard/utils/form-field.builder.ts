import { Validators } from "@angular/forms";
import { CustomValidators } from "@shared/utils";
import {
  FormFieldConfig,
  FormFieldValidator,
  FormFieldValidatorsConfig
} from "../models";

export class FormFieldBuilder {
  constructor(private config: FormFieldConfig) {}

  setValidators(validatorsConfig: FormFieldValidatorsConfig) {
    const validators = Object.keys(validatorsConfig).map((validatorName) => {
      const validator =
        (CustomValidators as Record<string, any>)[validatorName] ??
        (Validators as Record<string, any>)[validatorName];

      if (!validator) {
        throw new Error(`Such validator doesn't exist: [${validatorName}]`);
      }

      return {
        validator,
        error: validatorsConfig[validatorName]
      } as FormFieldValidator;
    });

    this.config.validators = validators;
    return this;
  }

  setTooltip(tooltip: string) {
    this.config.tooltip = tooltip;
    return this;
  }

  setPlaceholder(placeholder: string) {
    this.config.placeholder = placeholder;
    return this;
  }

  getConfig(): FormFieldConfig {
    return this.config;
  }
}
