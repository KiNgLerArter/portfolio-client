import { ErrorMessagePriority } from "@basic/form-wizard";
import { FormFieldValidatorsConfig } from "@basic/form-wizard/models";
import { Fields } from "../models";

/**
 * CONFIGS GUIDE:
 * Set null to required field to use auto-generated required config
 *
 * Set null or any other value to params field to tell that the validator return type is ValidatorFn.
 * It means that the validator function should be called to get the validator
 */
export const fieldsValidatorsConfig: Readonly<
  Record<Fields, FormFieldValidatorsConfig>
> = {
  [Fields.EMAIL]: {
    required: null,
    email: {
      errorKey: "email",
      priority: ErrorMessagePriority.SECOND,
      message: "Incorrect email format"
    }
  },
  [Fields.NICK]: {
    required: null
  },
  [Fields.PASS]: {
    required: null,
    minLength: {
      errorKey: "minlength",
      priority: ErrorMessagePriority.SECOND,
      message: "Password's minimum length is 3 symbols",
      params: 3
    },
    maxLength: {
      errorKey: "maxlength",
      priority: ErrorMessagePriority.SECOND,
      message: "Password's maximum length is 16 symbols",
      params: 16
    }
  }
};
