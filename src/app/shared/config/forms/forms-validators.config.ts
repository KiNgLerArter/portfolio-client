import { ErrorMessagePriority } from "@shared/basic/form-wizard";
import { FormFieldValidatorsConfig } from "@shared/basic/form-wizard/models";
import { Fields } from "./forms.config";

export const fieldsValidatorsConfig: Record<Fields, FormFieldValidatorsConfig> =
  {
    [Fields.EMAIL]: {
      required: {
        name: "required",
        priority: ErrorMessagePriority.FIRST,
        message: "Email is required"
      },
      email: {
        name: "email",
        priority: ErrorMessagePriority.SECOND,
        message: "Incorrect email format"
      }
    },
    [Fields.NICK]: {
      required: {
        name: "required",
        priority: ErrorMessagePriority.FIRST,
        message: "Nickname is required"
      }
    }
  };
