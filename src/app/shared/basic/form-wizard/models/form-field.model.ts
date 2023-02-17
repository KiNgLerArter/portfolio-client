import { ValidatorFn } from "@angular/forms";

export enum FieldType {
  TEXT = "text-input",
  NUMBER = "number-input",
  OPTIONS = "select"
}

export enum ErrorMessagePriority {
  ALWAYS = "always",
  ONLY = "only error left",
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5
}

export interface FormFieldConfig {
  type: FieldType;
  label: string;
  validators?: FormFieldValidator[];
  tooltip?: string;
  placeholder?: string;
}

export type FormFieldValidatorsConfig = Record<string, FormFieldError>;

export interface FormFieldValidator {
  validator: ValidatorFn;
  error: FormFieldError;
}

export interface FormFieldError {
  name: string;
  priority: ErrorMessagePriority;
  message: string;
}
