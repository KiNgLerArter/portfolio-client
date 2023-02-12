import { Validator } from "@angular/forms";

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

export interface FieldConfig {
  validators?: FieldValidator[];
  label?: string;
  fieldType?: FieldType;
}

export interface FieldValidator {
  validator: Validator;
  error: { priority: ErrorMessagePriority; message: string };
}
