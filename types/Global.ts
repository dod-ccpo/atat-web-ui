export interface Dialog {
  isDisplayed: boolean;
  type: string;
  setFocus: boolean;
  width: string;
  height: string;
  props: any | null;
}

export interface Toast {
  isDisplayed: boolean;
  message: string;
  contentClass: string;
}
