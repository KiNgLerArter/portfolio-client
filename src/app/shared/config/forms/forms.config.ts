import { FieldType, FormWizard } from "@basic/form-wizard";
import { fieldsValidatorsConfig } from "./forms-validators.config";

export enum Fields {
  EMAIL = "email",
  NICK = "nickname",
  PASS = "password"
}

export const formFieldsConfigs = {
  [Fields.EMAIL]: FormWizard.generateField({
    type: FieldType.TEXT,
    label: "Email"
  })
    .setValidators(fieldsValidatorsConfig.email)
    .getConfig(),
  [Fields.NICK]: FormWizard.generateField({
    type: FieldType.TEXT,
    label: "Nickname"
  })
    .setValidators(fieldsValidatorsConfig.nickname)
    .getConfig()
};