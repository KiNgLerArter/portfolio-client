export interface DialogData {
  title?: string;
  text?: string;
  actions?: {
    cancel?: {
      text?: string;
      onClick?: () => {};
    };
    accept?: {
      text?: string;
      onClick?: () => {};
    };
  };
}
