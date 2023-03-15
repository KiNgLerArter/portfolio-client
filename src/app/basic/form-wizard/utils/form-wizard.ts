import { FormFieldConfig } from "../models";
import { FormFieldBuilder } from ".";

export class FormWizard {
  static generateField(
    config: Pick<FormFieldConfig, "type" | "label">
  ): FormFieldBuilder {
    return new FormFieldBuilder(config);
  }
}
