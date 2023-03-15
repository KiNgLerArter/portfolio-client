import { Validators } from "@angular/forms";
import { CustomValidators, isUndefined } from "@shared/utils";
import {
  ErrorMessagePriority,
  FormFieldConfig,
  FormFieldError,
  FormFieldValidator,
  FormFieldValidatorsConfig
} from "../models";

export class FormFieldBuilder {
  constructor(private config: FormFieldConfig) {}

  setValidators(validatorsConfig: FormFieldValidatorsConfig) {
    const validators = Object.keys(validatorsConfig).map((validatorName) => {
      let validator =
        (CustomValidators as Record<string, any>)[validatorName] ??
        (Validators as Record<string, any>)[validatorName];

      if (!validator) {
        throw new Error(`Such validator doesn't exist: [${validatorName}]`);
      }

      const validatorParams = validatorsConfig[validatorName]?.params;
      if (!isUndefined(validatorParams)) {
        validator = validator(validatorParams);
      }

      const isAutoRequired =
        validatorName === "required" && !validatorsConfig[validatorName];
      const error: FormFieldError = isAutoRequired
        ? {
            errorKey: "required",
            priority: ErrorMessagePriority.FIRST,
            message: `${this.config.label} is required`
          }
        : validatorsConfig[validatorName];

      return {
        validator,
        error
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
