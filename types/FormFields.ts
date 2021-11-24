export interface UploadedFile {
  name: string;
}

export interface ValidationRule {
  [key: string]: any;
}

export interface TextBoxProps {
  rules?: [];
  id?: string;
  outlined?: boolean;
  dense?: boolean;
  success?: boolean;
  prefix?: string;
  error?: boolean;
  errorMessages?: string[];
  height?: number;
  rounded?: boolean;
  hideDetails?: string;
  validateOnBlur?: boolean;
  validateOnLoad?: boolean;
  class?: string[];
  // to be completed when have data structure for portfolio summary cards finalized
}

export interface CurrencyTextBoxProps {
  prefix: string;
  clearable: boolean;
}