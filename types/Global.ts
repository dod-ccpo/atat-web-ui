export interface StepperStep {
    stepNumber?: string;
    completed?: boolean;
    completePercentageWeight?: number;
    menuText?: string;
    route: string;
    subSteps?: StepperStep[];   
}
export interface RadioButton {
 id: string;
 label: string;
 value: string;
 description?: string;
}
export interface Checkbox {
  id: string;
  label: string;
  value: string;
  description?: string;
}