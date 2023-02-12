import { FieldConfig, FieldType, FieldValidator } from "../models";

export class FormWizardField {
  private config: FieldConfig;

  constructor(fieldType: FieldType) {
    this.config = { fieldType };
  }

  private getInstance(): FormWizardField {
    return this;
  }

  setValidators(validators: FieldValidator[]) {
    this.config.validators = validators;
    return this.getInstance();
  }

  setLabel(label: string) {
    this.config.label = label;
    return this.getInstance();
  }
}
