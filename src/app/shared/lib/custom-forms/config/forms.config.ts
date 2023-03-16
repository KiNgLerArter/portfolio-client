import { FieldType, FormWizard } from "@basic/form-wizard";

import { fieldsValidatorsConfig } from "./forms-validators.config";
import { Fields } from "../models";

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
    .getConfig(),
  [Fields.PASS]: FormWizard.generateField({
    type: FieldType.TEXT,
    label: "Password"
  })
    .setValidators(fieldsValidatorsConfig.password)
    .getConfig()
};
