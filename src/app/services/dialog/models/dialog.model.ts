export interface DialogData {
  title?: string;
  text?: string;
  actions?: {
    cancel?: {
      text?: string;
      onClick?: () => void;
    };
    accept?: {
      text?: string;
      onClick?: () => void;
    };
  };
}
