import { FormFieldBuilder } from ".";
import { FormFieldConfig } from "../models";

export class FormWizard {
  static generateField(
    config: Pick<FormFieldConfig, "type" | "label">
  ): FormFieldBuilder {
    return new FormFieldBuilder(config);
  }
}
