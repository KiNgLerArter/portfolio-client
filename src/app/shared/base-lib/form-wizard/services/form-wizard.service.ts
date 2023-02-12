import { Injectable } from "@angular/core";
import { FieldType, ItemType } from "../models";
import { FormWizardField, FormWizardGroup } from "../utils";

export class FormWizard {
  private generate(itemType: ItemType, props: FieldType) {
    switch (itemType) {
      case ItemType.CONTROL:
        return new FormWizardField(props);
      case ItemType.GROUP:
        return new FormWizardGroup();
    }
  }

  generateField(type: FieldType): FormWizardField {
    return this.generate(ItemType.CONTROL, type) as FormWizardField;
  }
}
