export interface UploadedFile {
  name: string;
}

export interface ValidationRule {
  [key: string]: any;
}

export interface Dialog {
  isDisplayed: boolean;
  type: string;
  setFocus: boolean;
  width: string;
  height: string;
}
